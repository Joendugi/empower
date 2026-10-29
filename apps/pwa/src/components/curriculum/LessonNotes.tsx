import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import type { Lesson } from '@cyberlearn/types';
import Markdown from '@/components/curriculum/Markdown';
import { loadLessonNotes } from '@/lib/lessonNotes';

/** Full reading notes shown in the lesson briefing, when the lesson has them. */
export default function LessonNotes({ lesson }: { lesson: Lesson }) {
  const [notes, setNotes] = useState<string | null>(lesson.contentMd ?? null);

  useEffect(() => {
    let alive = true;
    void loadLessonNotes(lesson).then((text) => {
      if (alive) setNotes(text);
    });
    return () => {
      alive = false;
    };
  }, [lesson]);

  if (!notes) return null;
  return (
    <details open className="group rounded-xl border border-white/[0.08] bg-white/[0.02]">
      <summary className="cursor-pointer select-none px-4 py-3 text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        Detailed lesson notes
      </summary>
      <div className="px-4 pb-4">
        <Markdown source={notes} />
      </div>
    </details>
  );
}
