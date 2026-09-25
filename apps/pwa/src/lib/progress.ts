import type { SkillPath } from '@cyberlearn/types';
import { getSkillPaths } from '@/content';

export interface ProgrammeProgress {
  path: SkillPath;
  done: number;
  total: number;
  percent: number;
  complete: boolean;
  nextLessonId?: string;
}

export function pathLessonIds(path: SkillPath) {
  return path.nodes.flatMap((node) => node.lessonIds);
}

export function programmeProgress(path: SkillPath, completedLessonIds: string[]): ProgrammeProgress {
  const lessonIds = pathLessonIds(path);
  const doneSet = new Set(completedLessonIds);
  const done = lessonIds.filter((id) => doneSet.has(id)).length;
  const nextLessonId = lessonIds.find((id) => !doneSet.has(id));
  return {
    path,
    done,
    total: lessonIds.length,
    percent: lessonIds.length ? Math.round((done / lessonIds.length) * 100) : 0,
    complete: lessonIds.length > 0 && done === lessonIds.length,
    nextLessonId,
  };
}

export function allProgrammeProgress(completedLessonIds: string[]) {
  return getSkillPaths().map((path) => programmeProgress(path, completedLessonIds));
}

export interface Achievement {
  id: string;
  icon: string;
  earned: boolean;
}

export function deriveAchievements({
  completedCount,
  streak,
  level,
  certificates,
}: {
  completedCount: number;
  streak: number;
  level: number;
  certificates: number;
}): Achievement[] {
  return [
    { id: 'firstLessonAch', icon: '📘', earned: completedCount >= 1 },
    { id: 'fiveLessonsAch', icon: '5️⃣', earned: completedCount >= 5 },
    { id: 'tenLessonsAch', icon: '🔟', earned: completedCount >= 10 },
    { id: 'streak3Ach', icon: '🔥', earned: streak >= 3 },
    { id: 'streak7Ach', icon: '⚡', earned: streak >= 7 },
    { id: 'level2Ach', icon: '⭐', earned: level >= 2 },
    { id: 'firstCertAch', icon: '📜', earned: certificates >= 1 },
  ];
}
