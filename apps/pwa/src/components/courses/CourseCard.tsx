import { clsx } from 'clsx';
import type { SkillPath } from '@cyberlearn/types';
import { courseIcon, courseLessonCount } from '@/lib/courseMeta';
import type { ProgrammeProgress } from '@/lib/progress';
import { useT } from '@/i18n';

export default function CourseCard({
  path,
  language,
  progress,
  chosen,
  onOpen,
}: {
  path: SkillPath;
  language: 'en' | 'sw';
  progress?: ProgrammeProgress;
  chosen?: boolean;
  onOpen: () => void;
}) {
  const t = useT();
  const title = language === 'sw' && path.titleSw ? path.titleSw : path.title;
  const description = language === 'sw' && path.descriptionSw ? path.descriptionSw : path.description;
  const isTvet = path.track === 'tvet';
  const isTrades = path.track === 'trades';
  const trackLabel = isTrades ? t('tradesTrack') : isTvet ? t('tvetTrack') : t('cyberTrack');
  const lessons = courseLessonCount(path);

  return (
    <article className="card h-full flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden>
          {courseIcon(path)}
        </span>
        <span
          className={clsx(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full',
            isTrades ? 'bg-amber-500/15 text-amber-200' : isTvet ? 'bg-blue-500/15 text-blue-300' : 'bg-accent/10 text-accent'
          )}
        >
          {trackLabel}
        </span>
      </div>
      <h3 className="font-semibold text-white mt-3">{title}</h3>
      <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-3 flex-1">{description}</p>
      <p className="text-xs text-muted mt-3">
        {path.nodes.length} {t('modules')} · {lessons} {t('lessons')}
        {progress && progress.done > 0 ? ` · ${progress.percent}%` : ''}
      </p>
      {path.certificationTarget && (
        <p className="text-xs text-accent mt-2 line-clamp-2">{path.certificationTarget}</p>
      )}
      {progress && progress.done > 0 && (
        <div className="xp-bar mt-3">
          <div className="xp-bar-fill" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
      <button type="button" className="btn-primary w-full mt-4 !py-2.5 text-sm" onClick={onOpen}>
        {chosen || (progress && progress.done > 0) ? t('openCourse') : t('chooseCourse')}
      </button>
    </article>
  );
}
