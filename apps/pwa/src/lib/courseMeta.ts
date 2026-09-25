import type { SkillPath } from '@cyberlearn/types';
import { tradeProgrammes } from '@/content/trades';

const icons: Record<string, string> = {
  'tvet-ict-technician': '💻',
  cybersecurity: '🛡️',
};

for (const programme of tradeProgrammes) {
  icons[programme.id] = programme.icon;
}

export function courseIcon(path: SkillPath) {
  return icons[path.id] ?? path.nodes[0]?.icon ?? '📘';
}

export function courseLessonCount(path: SkillPath) {
  return path.nodes.reduce((sum, node) => sum + node.lessonIds.length, 0);
}
