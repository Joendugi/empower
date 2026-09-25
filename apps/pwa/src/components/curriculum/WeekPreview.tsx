import type { Lesson } from '@cyberlearn/types';
import MediaBlock from '@/components/media/MediaBlock';
import { outlineItems } from '@/lib/curriculumDraft';
import { useT } from '@/i18n';

export default function WeekPreview({
  lesson,
  weekNumber,
  compact,
  onMediaComplete,
}: {
  lesson: Lesson;
  weekNumber?: number;
  compact?: boolean;
  onMediaComplete?: () => void;
}) {
  const t = useT();
  const week = weekNumber ?? lesson.weekNumber ?? 1;
  const items = outlineItems(lesson.outline ?? '');
  const notes = (lesson.briefing ?? '').trim();
  const quizCount = lesson.exercises.filter(
    (exercise) => exercise.type === 'MULTIPLE_CHOICE' || exercise.type === 'FILL_BLANK'
  ).length;

  return (
    <article className="space-y-5">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.18em] text-accent font-semibold">
          {t('weekLabel')} {week}
        </p>
        <h2 className="text-2xl font-bold">{lesson.title}</h2>
        <p className="text-xs text-muted">
          {lesson.estimatedMinutes} {t('minutes')}
          {quizCount ? ` · ${quizCount} ${t('autogradedItems')}` : ''}
          {lesson.media?.some((asset) => asset.kind === 'video') ? ` · ${t('includesVideo')}` : ''}
        </p>
      </header>

      {items.length > 0 && (
        <section className={compact ? 'space-y-2' : 'card space-y-2'}>
          <h3 className="text-sm font-semibold text-muted">{t('weekOutline')}</h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-white/90">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      )}

      {notes && (
        <section className={compact ? 'space-y-3' : 'card space-y-3'}>
          <h3 className="text-sm font-semibold text-muted">{t('weekContent')}</h3>
          {notes.split(/\n\n+/).map((para, index) => (
            <p key={index} className="text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap">
              {para}
            </p>
          ))}
        </section>
      )}

      <MediaBlock assets={lesson.media} onComplete={onMediaComplete} />
    </article>
  );
}
