import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import type { ProgrammeTrack } from '@cyberlearn/types';
import AppHeader from '@/components/ui/AppHeader';
import AutogradeTry from '@/components/curriculum/AutogradeTry';
import CourseOutline from '@/components/curriculum/CourseOutline';
import WeekPreview from '@/components/curriculum/WeekPreview';
import {
  blankCourse,
  blankQuiz,
  blankWeek,
  buildCourseFromDraft,
  draftChecks,
  type CourseDraft,
  type QuizDraft,
  type QuizKind,
  type WeekDraft,
} from '@/lib/curriculumDraft';
import { useCurriculumStore } from '@/store/curriculumStore';
import { useLearnerStore } from '@/store/learnerStore';
import { useT } from '@/i18n';

const field = 'w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-3 text-white placeholder:text-muted';

export default function CurriculumStudioPage() {
  const t = useT();
  const navigate = useNavigate();
  const drafts = useCurriculumStore((state) => state.drafts);
  const paths = useCurriculumStore((state) => state.paths);
  const saveDraft = useCurriculumStore((state) => state.saveDraft);
  const removeDraft = useCurriculumStore((state) => state.removeDraft);
  const publishDraft = useCurriculumStore((state) => state.publishDraft);
  const learnerId = useLearnerStore((state) => state.learnerId) ?? undefined;
  const email = useLearnerStore((state) => state.email) ?? undefined;
  const [selectedId, setSelectedId] = useState<string | null>(drafts[0]?.id ?? null);
  const [draft, setDraft] = useState<CourseDraft | null>(drafts[0] ?? null);
  const [weekIndex, setWeekIndex] = useState(0);
  const [mode, setMode] = useState<'edit' | 'week' | 'outline'>('edit');
  const [message, setMessage] = useState('');

  const openDraft = (next: CourseDraft) => {
    setDraft(next);
    setSelectedId(next.id);
    setWeekIndex(0);
    setMode('edit');
    setMessage('');
  };

  const persist = (next: CourseDraft) => {
    setDraft(next);
    saveDraft(next);
  };

  const create = () => {
    const next = blankCourse({ ownerId: learnerId, ownerEmail: email });
    persist(next);
    openDraft(next);
  };

  const week = draft?.weeks[weekIndex] ?? draft?.weeks[0];
  const preview = useMemo(() => (draft ? buildCourseFromDraft(draft) : null), [draft]);
  const checks = draft ? draftChecks(draft) : null;
  const previewLessons = preview ? Object.fromEntries(preview.lessons.map((lesson) => [lesson.id, lesson])) : {};
  const previewLesson = preview?.lessons[weekIndex] ?? preview?.lessons[0];

  const updateWeek = (patch: Partial<WeekDraft>) => {
    if (!draft || !week) return;
    persist({
      ...draft,
      weeks: draft.weeks.map((item) => (item.id === week.id ? { ...item, ...patch } : item)),
    });
  };

  const updateQuiz = (quizId: string, patch: Partial<QuizDraft>) => {
    if (!week) return;
    updateWeek({
      questions: week.questions.map((item) => (item.id === quizId ? { ...item, ...patch } : item)),
    });
  };

  const publish = () => {
    if (!draft || !checks?.valid) {
      setMessage(t('studioPublishBlocked'));
      setMode('edit');
      return;
    }
    persist(draft);
    const built = publishDraft(draft.id);
    if (!built) return;
    setMessage(t('studioPublished'));
    navigate(`/learn/course/${built.path.id}`);
  };

  return (
    <div className="min-h-dvh bg-primary-dark pb-16 text-white">
      <AppHeader home="/learn/skill-tree" />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">{t('studioKicker')}</p>
            <h1 className="text-3xl font-bold mt-1">{t('studioTitle')}</h1>
            <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">{t('studioHelp')}</p>
          </div>
          <button type="button" className="btn-primary" onClick={create}>
            {t('studioNew')}
          </button>
        </div>

        {message && <p className="card border-accent/40 text-accent">{message}</p>}

        {drafts.length === 0 && paths.length === 0 && (
          <p className="card text-muted">{t('studioEmpty')}</p>
        )}

        {drafts.length > 0 && (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {drafts
              .slice()
              .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
              .map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={clsx(
                      'card w-full text-left h-full',
                      selectedId === item.id && 'border-accent/50'
                    )}
                    onClick={() => openDraft(item)}
                  >
                    <p className="text-[11px] uppercase text-accent">
                      {item.status === 'published' ? t('studioLive') : t('studioDraft')}
                    </p>
                    <h2 className="font-semibold mt-1">{item.title || t('studioUntitled')}</h2>
                    <p className="text-xs text-muted mt-2">
                      {item.weeks.length} {t('weeks')}
                    </p>
                  </button>
                </li>
              ))}
          </ul>
        )}

        {draft && week && preview && previewLesson && (
          <section className="space-y-5">
            <div className="card grid md:grid-cols-2 gap-3">
              <input
                className={field}
                value={draft.title}
                onChange={(event) => persist({ ...draft, title: event.target.value })}
                placeholder={t('studioCourseTitle')}
              />
              <input
                className={field}
                value={draft.titleSw}
                onChange={(event) => persist({ ...draft, titleSw: event.target.value })}
                placeholder={t('studioCourseTitleSw')}
              />
              <textarea
                className={`md:col-span-2 min-h-24 ${field}`}
                value={draft.description}
                onChange={(event) => persist({ ...draft, description: event.target.value })}
                placeholder={t('studioCourseBody')}
              />
              <select
                className={field}
                value={draft.track}
                onChange={(event) => persist({ ...draft, track: event.target.value as ProgrammeTrack })}
              >
                <option value="trades">{t('tradesTrack')}</option>
                <option value="tvet">{t('tvetTrack')}</option>
                <option value="cybersecurity">{t('cyberTrack')}</option>
              </select>
              <input
                className={field}
                value={draft.certificationTarget}
                onChange={(event) => persist({ ...draft, certificationTarget: event.target.value })}
                placeholder={t('adminCert')}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {draft.weeks.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={weekIndex === index ? 'btn-primary !py-2 text-sm' : 'btn-secondary !py-2 text-sm'}
                  onClick={() => setWeekIndex(index)}
                >
                  {t('weekLabel')} {item.weekNumber}
                </button>
              ))}
              <button
                type="button"
                className="btn-secondary !py-2 text-sm"
                onClick={() => {
                  persist({ ...draft, weeks: [...draft.weeks, blankWeek(draft.weeks.length + 1)] });
                  setWeekIndex(draft.weeks.length);
                }}
              >
                {t('studioAddWeek')}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['edit', t('studioEdit')],
                  ['week', t('studioReviewWeek')],
                  ['outline', t('studioReviewOutline')],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={mode === id ? 'btn-primary !py-2 text-sm' : 'btn-secondary !py-2 text-sm'}
                  onClick={() => setMode(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            {mode === 'edit' && (
              <WeekEditor week={week} onChange={updateWeek} onQuiz={updateQuiz} onRemoveWeek={() => {
                if (draft.weeks.length === 1) return;
                const weeks = draft.weeks
                  .filter((item) => item.id !== week.id)
                  .map((item, index) => ({ ...item, weekNumber: index + 1 }));
                persist({ ...draft, weeks });
                setWeekIndex(Math.max(0, weekIndex - 1));
              }} />
            )}

            {mode === 'week' && (
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="card">
                  <p className="text-xs text-muted mb-4">{t('studioPreviewHint')}</p>
                  <WeekPreview lesson={previewLesson} weekNumber={week.weekNumber} />
                </div>
                <AutogradeTry exercises={previewLesson.exercises} lessonId={previewLesson.id} />
              </div>
            )}

            {mode === 'outline' && (
              <div className="card">
                <p className="text-xs text-muted mb-4">{t('studioOutlineHint')}</p>
                <h2 className="text-2xl font-bold">{draft.title || t('studioUntitled')}</h2>
                <p className="text-muted mt-2 leading-relaxed">{draft.description}</p>
                <div className="mt-6">
                  <CourseOutline
                    path={preview.path}
                    lessons={previewLessons}
                    activeWeek={week.weekNumber}
                    actionLabel={t('reviewWeekLayout')}
                    onOpenWeek={(_lessonId, weekNumber) => {
                      setWeekIndex(Math.max(0, weekNumber - 1));
                      setMode('week');
                    }}
                  />
                </div>
              </div>
            )}

            {checks && (
              <ul className="card grid sm:grid-cols-2 gap-2 text-sm">
                <Check ok={checks.title} label={t('studioCheckTitle')} />
                <Check ok={checks.description} label={t('studioCheckBody')} />
                <Check ok={checks.weeks} label={t('studioCheckWeeks')} />
                <Check ok={checks.httpsVideos} label={t('studioCheckVideo')} />
                {checks.weekIssues.map((item) => (
                  <Check
                    key={item.weekNumber}
                    ok={item.title && item.outline && item.content && item.quiz}
                    label={`${t('weekLabel')} ${item.weekNumber}: ${t('studioCheckWeekReady')}`}
                  />
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-secondary" onClick={() => persist(draft)}>
                {t('studioSave')}
              </button>
              <button type="button" className="btn-primary" onClick={publish} disabled={!checks?.valid}>
                {t('studioPublish')}
              </button>
              {draft.status === 'published' && (
                <Link to={`/learn/course/${draft.id}`} className="btn-secondary">
                  {t('openCourse')}
                </Link>
              )}
              <button
                type="button"
                className="btn-secondary text-danger"
                onClick={() => {
                  removeDraft(draft.id);
                  setDraft(null);
                  setSelectedId(null);
                }}
              >
                {t('studioDelete')}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return <li className={ok ? 'text-success' : 'text-danger'}>{ok ? '✓' : '×'} {label}</li>;
}

function WeekEditor({
  week,
  onChange,
  onQuiz,
  onRemoveWeek,
}: {
  week: WeekDraft;
  onChange: (patch: Partial<WeekDraft>) => void;
  onQuiz: (quizId: string, patch: Partial<QuizDraft>) => void;
  onRemoveWeek: () => void;
}) {
  const t = useT();
  return (
    <div className="card grid md:grid-cols-2 gap-3">
      <h2 className="md:col-span-2 text-lg font-semibold">
        {t('weekLabel')} {week.weekNumber}
      </h2>
      <input
        className={`md:col-span-2 ${field}`}
        value={week.title}
        onChange={(event) => onChange({ title: event.target.value })}
        placeholder={t('studioWeekTitle')}
      />
      <textarea
        className={`md:col-span-2 min-h-28 ${field}`}
        value={week.outline}
        onChange={(event) => onChange({ outline: event.target.value })}
        placeholder={t('studioOutlinePh')}
      />
      <textarea
        className={`md:col-span-2 min-h-64 ${field}`}
        value={week.content}
        onChange={(event) => onChange({ content: event.target.value })}
        placeholder={t('studioContentPh')}
      />
      <input
        className={field}
        type="url"
        value={week.videoUrl}
        onChange={(event) => onChange({ videoUrl: event.target.value })}
        placeholder={t('adminVideoUrl')}
      />
      <input
        className={field}
        value={week.videoCaption}
        onChange={(event) => onChange({ videoCaption: event.target.value })}
        placeholder={t('studioVideoCaption')}
      />

      <div className="md:col-span-2 flex items-center justify-between gap-3 mt-2">
        <h3 className="font-semibold">{t('studioQuizzes')}</h3>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary !py-2 text-sm" onClick={() => onChange({ questions: [...week.questions, blankQuiz('MULTIPLE_CHOICE')] })}>
            {t('studioAddMcq')}
          </button>
          <button type="button" className="btn-secondary !py-2 text-sm" onClick={() => onChange({ questions: [...week.questions, blankQuiz('FILL_BLANK')] })}>
            {t('studioAddBlank')}
          </button>
        </div>
      </div>

      {week.questions.map((quiz, index) => (
        <QuizEditor
          key={quiz.id}
          quiz={quiz}
          index={index}
          onChange={(patch) => onQuiz(quiz.id, patch)}
          onRemove={() => onChange({ questions: week.questions.filter((item) => item.id !== quiz.id) })}
        />
      ))}

      <button type="button" className="md:col-span-2 text-sm text-danger text-left" onClick={onRemoveWeek}>
        {t('studioRemoveWeek')}
      </button>
    </div>
  );
}

function QuizEditor({
  quiz,
  index,
  onChange,
  onRemove,
}: {
  quiz: QuizDraft;
  index: number;
  onChange: (patch: Partial<QuizDraft>) => void;
  onRemove: () => void;
}) {
  const t = useT();
  return (
    <fieldset className="md:col-span-2 rounded-2xl border border-surface-light p-4 grid md:grid-cols-2 gap-3">
      <legend className="px-2 text-sm text-muted">
        {t('autogradeTitle')} {index + 1}
      </legend>
      <label className="text-sm text-muted">
        {t('studioQuizType')}
        <select
          className={`${field} mt-1`}
          value={quiz.type}
          onChange={(event) => onChange({ type: event.target.value as QuizKind })}
        >
          <option value="MULTIPLE_CHOICE">{t('studioMcq')}</option>
          <option value="FILL_BLANK">{t('studioBlank')}</option>
        </select>
      </label>
      <button type="button" className="justify-self-end text-xs text-danger" onClick={onRemove}>
        {t('studioRemoveQuiz')}
      </button>
      <textarea
        className={`md:col-span-2 min-h-20 ${field}`}
        value={quiz.prompt}
        onChange={(event) => onChange({ prompt: event.target.value })}
        placeholder={quiz.type === 'FILL_BLANK' ? t('studioBlankPh') : t('studioMcqPh')}
      />
      {quiz.type === 'MULTIPLE_CHOICE' ? (
        <>
          {(['optionA', 'optionB', 'optionC', 'optionD'] as const).map((key, optionIndex) => (
            <input
              key={key}
              className={field}
              value={quiz[key]}
              onChange={(event) => onChange({ [key]: event.target.value })}
              placeholder={`${t('studioOption')} ${String.fromCharCode(65 + optionIndex)}`}
            />
          ))}
          <label className="text-sm text-muted">
            {t('adminCorrect')}
            <select
              className={`${field} mt-1`}
              value={quiz.correct}
              onChange={(event) => onChange({ correct: event.target.value as QuizDraft['correct'] })}
            >
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
            </select>
          </label>
        </>
      ) : (
        <input
          className={`md:col-span-2 ${field}`}
          value={quiz.blankAnswer}
          onChange={(event) => onChange({ blankAnswer: event.target.value })}
          placeholder={t('studioBlankAnswer')}
        />
      )}
      <textarea
        className={`md:col-span-2 min-h-16 ${field}`}
        value={quiz.explanation}
        onChange={(event) => onChange({ explanation: event.target.value })}
        placeholder={t('studioExplanation')}
      />
    </fieldset>
  );
}
