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
  const accent = isTrades ? '#f0c14e' : isTvet ? '#5b9dff' : '#00d4aa';

  return (
    <article className="programme-tile" style={{ ['--tile-accent' as string]: accent }}>
      <div className="flex items-start justify-between gap-3 pl-2">
        <span className="text-3xl" aria-hidden>
          {courseIcon(path)}
        </span>
        <span
          className={clsx(
            'text-[11px] font-semibold px-2 py-0.5 rounded-md border',
            isTrades
              ? 'border-amber-400/30 text-amber-200 bg-amber-500/10'
              : isTvet
                ? 'border-blue-400/30 text-blue-200 bg-blue-500/10'
                : 'border-accent/30 text-accent bg-accent/10'
          )}
        >
          {trackLabel}
        </span>
      </div>
      <h3 className="font-display font-semibold text-white text-lg mt-3 pl-2">{title}</h3>
      <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-3 flex-1 pl-2">{description}</p>
      <p className="text-xs text-muted mt-3 pl-2">
        {path.nodes.length} {t('modules')} · {lessons} {t('lessons')}
        {progress && progress.done > 0 ? ` · ${progress.percent}%` : ''}
      </p>
      {path.certificationTarget && (
        <p className="text-xs text-accent mt-2 line-clamp-2 pl-2">{path.certificationTarget}</p>
      )}
      {progress && progress.done > 0 && (
        <div className="xp-bar mt-3 ml-2">
          <div className="xp-bar-fill" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
      <button type="button" className="btn-primary w-full mt-4 !py-2.5 text-sm" onClick={onOpen}>
        {chosen || (progress && progress.done > 0) ? t('openCourse') : t('chooseCourse')}
      </button>
    </article>
  );
}
