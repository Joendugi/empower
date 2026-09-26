import { useEffect, useRef, useState } from 'react';
import type { Exercise } from '@cyberlearn/types';
import { pickRecorderMime, saveEvidence } from '@/lib/assetStore';
import type { GradeResult } from './types';
import { useT } from '@/i18n';

interface PracticalCaptureProps {
  exercise: Exercise;
  lessonId: string;
  onAnswer: (answer: string | string[]) => Promise<GradeResult>;
}

type Mode = 'idle' | 'live' | 'preview' | 'done';

export default function PracticalCapture({ exercise, lessonId, onAnswer }: PracticalCaptureProps) {
  const t = useT();
  const kind =
    exercise.type === 'AUDIO_RECORD' ? 'audio' : exercise.type === 'PHOTO_CAPTURE' ? 'photo' : 'video';
  const rubric = exercise.rubric ?? [];
  const minSeconds = exercise.minSeconds ?? (kind === 'photo' ? 0 : 8);
  const submitToken = kind === 'photo' ? 'captured' : kind === 'audio' ? 'spoken' : 'recorded';

  const liveRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const [mode, setMode] = useState<Mode>('idle');
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [xp, setXp] = useState(0);

  const rubricDone = rubric.length === 0 || rubric.every((_, index) => checked[index]);
  const longEnough = kind === 'photo' || seconds >= minSeconds;

  useEffect(() => {
    return () => {
      stopStream();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        kind === 'audio' ? { audio: true } : { video: { facingMode: 'environment' }, audio: kind === 'video' }
      );
      streamRef.current = stream;
      setMode('live');
      setSeconds(0);
      requestAnimationFrame(() => {
        if (liveRef.current && kind !== 'audio') {
          liveRef.current.srcObject = stream;
          void liveRef.current.play();
        }
      });
    } catch {
      setError(t('capturePermission'));
    }
  };

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream || typeof MediaRecorder === 'undefined') {
      setError(t('captureUnsupported'));
      return;
    }
    chunksRef.current = [];
    const mime = pickRecorderMime(kind === 'audio' ? 'audio' : 'video');
    const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || (kind === 'audio' ? 'audio/webm' : 'video/webm') });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
      setMode('preview');
      stopStream();
    };
    recorder.start(250);
    setRecording(true);
    timerRef.current = window.setInterval(() => setSeconds((value) => value + 1), 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setRecording(false);
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };

  const takePhoto = () => {
    const video = liveRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(blob));
        setMode('preview');
        stopStream();
      },
      'image/jpeg',
      0.92
    );
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSeconds(0);
    setRecording(false);
    setMode('idle');
    stopStream();
  };

  const submitBlob = async (blob: Blob) => {
    await saveEvidence({
      lessonId,
      exerciseId: exercise.id,
      kind,
      blob,
      name: `${kind}-${exercise.id}`,
    });
    const result = await onAnswer(submitToken);
    setXp(result.xpAwarded);
    setMode('done');
  };

  const submitPreview = async () => {
    if (!previewUrl || !rubricDone || !longEnough) return;
    const blob = await fetch(previewUrl).then((response) => response.blob());
    await submitBlob(blob);
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setMode('preview');
    setSeconds(kind === 'photo' ? 0 : Math.max(minSeconds, 1));
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-white">{exercise.prompt}</p>
      {exercise.hint && <p className="text-sm text-muted">{exercise.hint}</p>}

      {rubric.length > 0 && (
        <ul className="space-y-2">
          {rubric.map((item, index) => (
            <li key={item}>
              <label className="flex items-start gap-2 text-sm text-white/90">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={Boolean(checked[index])}
                  disabled={mode === 'done'}
                  onChange={(event) => setChecked((current) => ({ ...current, [index]: event.target.checked }))}
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {mode === 'live' && kind !== 'audio' && (
        <video ref={liveRef} className="w-full rounded-xl bg-black aspect-video" muted playsInline autoPlay />
      )}
      {mode === 'live' && kind === 'audio' && (
        <div className="media-stage">
          <p className="text-accent font-semibold">{t('captureListening')}</p>
          <p className="text-xs text-muted">
            {seconds}s {minSeconds ? `/ ${minSeconds}s` : ''}
          </p>
        </div>
      )}
      {mode === 'preview' && previewUrl && kind === 'audio' && <audio className="w-full" controls src={previewUrl} />}
      {mode === 'preview' && previewUrl && kind === 'video' && (
        <video className="w-full rounded-xl bg-black" controls src={previewUrl} />
      )}
      {mode === 'preview' && previewUrl && kind === 'photo' && (
        <img src={previewUrl} alt="" className="w-full rounded-xl max-h-80 object-contain bg-black" />
      )}

      {mode === 'live' && kind !== 'photo' && recording && (
        <p className="text-sm text-accent">
          {t('captureRecording')} {seconds}s
          {minSeconds ? ` · ${t('captureMinimum')} ${minSeconds}s` : ''}
        </p>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {mode === 'idle' && (
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" className="btn-primary" onClick={() => void startCamera()}>
            {kind === 'photo' ? t('captureOpenCamera') : kind === 'audio' ? t('captureOpenMic') : t('captureOpenCamera')}
          </button>
          <label className="btn-secondary text-center cursor-pointer">
            {t('captureUploadInstead')}
            <input
              type="file"
              className="hidden"
              accept={kind === 'audio' ? 'audio/*' : kind === 'photo' ? 'image/*' : 'video/*'}
              onChange={(event) => void onFile(event.target.files?.[0])}
            />
          </label>
        </div>
      )}

      {mode === 'live' && kind === 'photo' && (
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" className="btn-primary" onClick={takePhoto}>
            {t('captureSnap')}
          </button>
          <button type="button" className="btn-secondary" onClick={reset}>
            {t('captureCancel')}
          </button>
        </div>
      )}

      {mode === 'live' && kind !== 'photo' && !recording && (
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" className="btn-primary" onClick={startRecording}>
            {t('captureStart')}
          </button>
          <button type="button" className="btn-secondary" onClick={reset}>
            {t('captureCancel')}
          </button>
        </div>
      )}

      {mode === 'live' && kind !== 'photo' && recording && (
        <button type="button" className="btn-primary w-full" onClick={stopRecording} disabled={!longEnough}>
          {t('captureStop')}
        </button>
      )}

      {mode === 'preview' && (
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            className="btn-primary"
            disabled={!rubricDone || !longEnough}
            onClick={() => void submitPreview()}
          >
            {t('captureSubmit')}
          </button>
          <button type="button" className="btn-secondary" onClick={reset}>
            {t('captureRetake')}
          </button>
        </div>
      )}

      {mode === 'done' && (
        <p className="text-success text-sm font-medium">
          {t('captureSaved')} +{xp} XP
        </p>
      )}
    </div>
  );
}
