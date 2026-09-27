import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  GraduationCap, 
  Sparkles, 
  Play, 
  ArrowRight,
  UserPlus
} from 'lucide-react';
import type { ProgrammeTrack, SkillPath } from '@cyberlearn/types';
import CourseCard from '@/components/courses/CourseCard';
import LanguagePicker from '@/components/ui/LanguagePicker';
import BrandMark from '@/components/ui/BrandMark';
import { getSkillPaths } from '@/content';
import { programmeProgress } from '@/lib/progress';
import { useCurriculumStore } from '@/store/curriculumStore';
import { useLearnerStore, type LearnerGoal, type LearnerRole } from '@/store/learnerStore';
import { useLibraryStore } from '@/store/libraryStore';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const language = useLearnerStore((state) => state.language);
  const signedIn = Boolean(useLearnerStore((state) => state.token));
  const completedLessonIds = useLearnerStore((state) => state.completedLessonIds);
  const completeOnboarding = useLearnerStore((state) => state.completeOnboarding);
  const choosePath = useLearnerStore((state) => state.choosePath);
  const customPaths = useCurriculumStore((state) => state.paths);
  const paths = useMemo(() => getSkillPaths(), [customPaths]);

  const [selectedTrack, setSelectedTrack] = useState<ProgrammeTrack | 'all'>('all');
  const [selectedPathId, setSelectedPathId] = useState<string | null>(paths[0]?.id ?? null);
  const [role] = useState<LearnerRole>('student');
  const [goal] = useState<LearnerGoal>('certificate');

  const filteredPaths = useMemo(() => {
    if (selectedTrack === 'all') return paths;
    return paths.filter((p) => p.track === selectedTrack);
  }, [paths, selectedTrack]);

  const selected = paths.find((p) => p.id === selectedPathId) ?? paths[0];

  const handleLaunchCourse = (course: SkillPath) => {
    choosePath(course.id);
    useLibraryStore.getState().selectProgramme(course.id);
    completeOnboarding({ role, goal, track: course.track ?? 'all', pathId: course.id });
    navigate(`/learn/course/${course.id}`);
  };

  return (
    <div className="min-h-dvh bg-primary-dark text-white pb-16">
      {/* Header */}
      <header className="px-5 py-4 border-b border-white/[0.08] bg-primary-dark sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark size="sm" showText />
          </Link>
          <div className="flex items-center gap-3">
            <LanguagePicker />
            {!signedIn && (
              <Link to="/login" className="btn-secondary !py-1.5 !px-3 text-xs inline-flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8 space-y-8">
        {/* Top Hero: Instant Course Selection */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fast-Track Onboarding</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Select Your TVET Course Track
            </h1>
            <p className="text-muted-light mt-1.5 text-sm sm:text-base max-w-xl">
              Choose any trade or engineering discipline to open its interactive roadmap and start learning right away.
            </p>
          </div>

          {/* Quick Active Selection Launch Button */}
          {selected && (
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleLaunchCourse(selected)}
                className="btn-primary py-3 px-6 text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                Start {selected.title}
              </button>
            </div>
          )}
        </div>

        {/* Track Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/[0.08]">
          {[
            { id: 'all', label: 'All Programmes' },
            { id: 'trades', label: 'Technical Trades' },
            { id: 'tvet', label: 'Engineering & TVET' },
            { id: 'cybersecurity', label: 'Cybersecurity & ICT' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTrack(tab.id as ProgrammeTrack | 'all')}
              className={clsx(
                'px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0',
                selectedTrack === tab.id
                  ? 'bg-accent text-white'
                  : 'bg-surface/60 text-muted hover:text-white hover:bg-surface-light border border-white/[0.08]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course Grid: Instant Direct Launch */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPaths.map((path) => {
            const isSelected = path.id === selectedPathId;
            return (
              <div
                key={path.id}
                onClick={() => setSelectedPathId(path.id)}
                className={clsx(
                  'cursor-pointer transition-all',
                  isSelected && 'ring-2 ring-accent rounded-2xl'
                )}
              >
                <CourseCard
                  path={path}
                  language={language}
                  progress={programmeProgress(path, completedLessonIds)}
                  chosen={isSelected}
                  onOpen={() => handleLaunchCourse(path)}
                />
              </div>
            );
          })}
        </div>

        {/* Quick Account Prompt if not signed in */}
        {!signedIn && (
          <div className="card !p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-base text-white">Save Your Streak & Certification Progress</h2>
                <p className="text-xs text-muted mt-0.5">
                  You can explore courses immediately. Create an account anytime to sync achievements across devices.
                </p>
              </div>
            </div>
            <Link to="/login" className="btn-secondary !py-2.5 !px-5 text-xs font-semibold shrink-0 whitespace-nowrap">
              Create Free Account <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
