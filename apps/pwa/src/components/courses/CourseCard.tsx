import { clsx } from 'clsx';
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
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
  const isCompleted = progress && progress.percent === 100;

  return (
    <article className="card-interactive h-full flex flex-col justify-between !p-6 border-white/[0.08] group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-light border border-white/[0.08] flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-accent/15 group-hover:border-accent/30 transition-all shadow-inner">
            {courseIcon(path)}
          </div>
          <span
            className={clsx(
              'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border',
              isTrades
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                : isTvet
                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/25'
                  : 'bg-accent/15 text-accent border-accent/25'
            )}
          >
            {trackLabel}
          </span>
        </div>

        <h3 className="font-bold text-lg text-white mt-4 group-hover:text-accent transition-colors leading-snug">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-between text-xs text-muted mb-2 font-medium">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-muted" />
            {path.nodes.length} {t('modules')} · {lessons} {t('lessons')}
          </span>
          {progress && progress.done > 0 && (
            <span className={clsx('font-bold', isCompleted ? 'text-success' : 'text-accent')}>
              {progress.percent}%
            </span>
          )}
        </div>

        {path.certificationTarget && (
          <p className="text-[11px] text-accent/90 mb-3 line-clamp-1 font-mono">
            {path.certificationTarget}
          </p>
        )}

        {progress && progress.done > 0 && (
          <div className="xp-bar mb-3">
            <div className="xp-bar-fill" style={{ width: `${progress.percent}%` }} />
          </div>
        )}

        <button 
          type="button" 
          className={clsx(
            'w-full text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all',
            chosen || (progress && progress.done > 0)
              ? 'btn-primary'
              : 'btn-secondary group-hover:btn-primary'
          )}
          onClick={onOpen}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Review Course</span>
            </>
          ) : chosen || (progress && progress.done > 0) ? (
            <>
              <span>{t('openCourse')}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" />
              <span>{t('chooseCourse')}</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
