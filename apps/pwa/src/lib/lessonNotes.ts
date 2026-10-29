import type { Lesson } from '@cyberlearn/types';

let bundled: Promise<Record<string, string>> | null = null;

/** Detailed notes for a lesson: from the lesson itself (cloud/custom) or the lazily loaded bundled file. */
export async function loadLessonNotes(lesson: Lesson): Promise<string | null> {
  if (lesson.contentMd?.trim()) return lesson.contentMd;
  if (!bundled) {
    bundled = import('@/content/generated/lessonNotes.json').then(
      (mod) => (mod.default ?? mod) as Record<string, string>
    );
  }
  try {
    return (await bundled)[lesson.id] ?? null;
  } catch {
    bundled = null; // allow a retry once the chunk is reachable
    return null;
  }
}
