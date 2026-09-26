import type { SkillPath } from '@cyberlearn/types';
import { tradeProgrammes } from '@/content/trades';

/** Two-letter mark for a programme — replaces emoji icons in the UI. */
const marks: Record<string, string> = {
  'tvet-ict-technician': 'ICT',
  cybersecurity: 'CY',
  'digital-enterprise': 'DE',
};

for (const programme of tradeProgrammes) {
  marks[programme.id] = initialsFromTitle(programme.title);
}

function initialsFromTitle(title: string): string {
  const words = title
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return 'PR';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function courseMark(path: SkillPath): string {
  return marks[path.id] ?? initialsFromTitle(path.title);
}

/** @deprecated Prefer courseMark — kept for any lingering call sites during migration. */
export function courseIcon(path: SkillPath): string {
  return courseMark(path);
}

export function programmeMark(id: string, title: string): string {
  return marks[id] ?? initialsFromTitle(title);
}

export function courseLessonCount(path: SkillPath) {
  return path.nodes.reduce((sum, node) => sum + node.lessonIds.length, 0);
}
