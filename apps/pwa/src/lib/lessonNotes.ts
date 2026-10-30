import type { Lesson } from '@cyberlearn/types';
import { getLessonAsync } from '@/content';

/** Detailed notes for a lesson. Catalogue lessons carry them in their course pack. */
export async function loadLessonNotes(lesson: Lesson): Promise<string | null> {
  if (lesson.contentMd?.trim()) return lesson.contentMd;
  try {
    const full = await getLessonAsync(lesson.id);
    return full?.contentMd?.trim() ? full.contentMd : null;
  } catch {
    return null;
  }
}
