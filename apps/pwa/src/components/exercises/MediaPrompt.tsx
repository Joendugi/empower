import { useState } from 'react';
import type { ExerciseProps } from './types';
import MediaBlock from '@/components/media/MediaBlock';
import { useT } from '@/i18n';

export default function MediaPrompt({ exercise, onAnswer }: ExerciseProps) {
  const t = useT();
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!ready || done) return;
    await onAnswer('watched');
    setDone(true);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-white">{exercise.prompt}</p>
      <MediaBlock assets={exercise.media} onComplete={() => setReady(true)} />
      <button className="btn-primary w-full" type="button" disabled={!ready || done} onClick={() => void submit()}>
        {done ? t('correct') : t('mediaConfirm')}
      </button>
    </div>
  );
}
