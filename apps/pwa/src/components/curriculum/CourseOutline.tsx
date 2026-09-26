import { clsx } from 'clsx';
import type { Lesson, SkillPath } from '@cyberlearn/types';
import { getLesson } from '@/content';
import { outlineItems } from '@/lib/curriculumDraft';
import { useT } from '@/i18n';

export default function CourseOutline({
  path,
  lessons,
  completedLessonIds = [],
  activeWeek,
  onOpenWeek,
  actionLabel,
}: {
  path: SkillPath;
  lessons?: Record<string, Lesson>;
  completedLessonIds?: string[];
  activeWeek?: number;
  onOpenWeek?: (lessonId: string, weekNumber: number) => void;
  actionLabel?: string;
}) {
  const t = useT();
  const resolve = (id?: string) => (id ? lessons?.[id] ?? getLesson(id) : undefined);

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold">{t('courseOutline')}</h2>
      <ol className="space-y-2">
        {path.nodes.map((node, index) => {
          const week = node.weekNumber ?? index + 1;
          const lessonId = node.lessonIds[0];
          const lesson = resolve(lessonId);
          const items = outlineItems(node.outline ?? lesson?.outline ?? '');
          const hasVideo = Boolean(lesson?.media?.some((asset) => asset.kind === 'video'));
          const quizCount = lesson?.exercises.filter(
            (exercise) => exercise.type === 'MULTIPLE_CHOICE' || exercise.type === 'FILL_BLANK'
          ).length ?? 0;
          const done = lessonId ? completedLessonIds.includes(lessonId) : false;
          const prereqMet = (node.prerequisites ?? []).every((id) => {
            const required = path.nodes.find((item) => item.id === id);
            if (!required?.lessonIds.length) return true;
            return required.lessonIds.every((id) => completedLessonIds.includes(id));
          });
          const locked = Boolean(node.prerequisites?.length) && !prereqMet;
          const active = activeWeek === week;

          return (
            <li key={node.id}>
              <article
                className={clsx(
                  'unit-row space-y-3',
                  locked && 'opacity-55 hover:border-surface-light/70',
                  active && 'border-accent/50'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-accent font-semibold">
                      {t('weekLabel')} {week}
                    </p>
                    <h3 className="font-display font-semibold mt-1">{lesson?.title ?? node.title}</h3>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-muted shrink-0 mt-1">
                    {locked ? t('locked') : done ? 'Done' : ''}
                  </span>
                </div>
                {items.length > 0 && (
                  <ul className="text-sm text-muted space-y-1">
                    {items.slice(0, 4).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-muted">
                  {hasVideo ? t('includesVideo') : t('notesOnly')}
                  {quizCount ? ` · ${quizCount} ${t('autogradedItems')}` : ''}
                </p>
                {!locked && lessonId && onOpenWeek && (
                  <button
                    type="button"
                    className="btn-secondary !py-2 text-sm"
                    onClick={() => onOpenWeek(lessonId, week)}
                  >
                    {actionLabel ?? t('openWeek')}
                  </button>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
