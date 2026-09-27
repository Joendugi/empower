import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tradeLessons, tradePaths } from '../src/content/trades/index.ts';
import type { Exercise, Lesson, SkillPath } from '@cyberlearn/types';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const lessonsDir = join(root, 'content', 'lessons');
const pathsDir = join(root, 'content', 'skill-paths');

function pad(level: number) {
  return '  '.repeat(level);
}

function dump(value: unknown, level = 0): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad(level)}[]`.trimStart() && '[]';
    return value
      .map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const lines = objectLines(item as Record<string, unknown>, level + 1);
          return `${pad(level)}- ${lines[0].trimStart()}\n${lines.slice(1).join('\n')}`;
        }
        return `${pad(level)}- ${dump(item, 0)}`;
      })
      .join('\n');
  }
  return objectLines(value as Record<string, unknown>, level).join('\n');
}

function objectLines(obj: Record<string, unknown>, level: number): string[] {
  const lines: string[] = [];
  for (const [key, child] of Object.entries(obj)) {
    if (child === undefined) continue;
    if (Array.isArray(child)) {
      if (child.length === 0) {
        lines.push(`${pad(level)}${key}: []`);
      } else {
        lines.push(`${pad(level)}${key}:`);
        lines.push(dump(child, level + 1));
      }
    } else if (child && typeof child === 'object') {
      lines.push(`${pad(level)}${key}:`);
      lines.push(dump(child, level + 1));
    } else {
      lines.push(`${pad(level)}${key}: ${dump(child)}`);
    }
  }
  return lines;
}

function exerciseToYaml(exercise: Exercise) {
  return {
    id: exercise.id,
    type: exercise.type,
    prompt: exercise.prompt,
    options: exercise.options,
    pairs: exercise.pairs,
    drag_items: exercise.dragItems,
    diagram_slots: exercise.diagramSlots,
    diagram_kind: exercise.diagramKind,
    terminal_responses: exercise.terminalResponses,
    correct_answer: exercise.correctAnswer,
    hint: exercise.hint,
    explanation: exercise.explanation,
    xp_reward: exercise.xpReward,
    media: exercise.media,
    rubric: exercise.rubric,
    min_seconds: exercise.minSeconds,
  };
}

function lessonToYaml(lesson: Lesson) {
  return {
    id: lesson.id,
    course_id: lesson.courseId,
    title: lesson.title,
    title_sw: lesson.titleSw,
    briefing: lesson.briefing,
    briefing_sw: lesson.briefingSw,
    estimated_minutes: lesson.estimatedMinutes,
    license: lesson.license ?? 'CC-BY-SA-4.0',
    cdacc_unit_id: lesson.cdaccUnitId,
    exam_domain: lesson.examDomain,
    media: lesson.media,
    exercises: lesson.exercises.map(exerciseToYaml),
  };
}

function pathToYaml(path: SkillPath) {
  return {
    id: path.id,
    title: path.title,
    title_sw: path.titleSw,
    description: path.description,
    description_sw: path.descriptionSw,
    certification_target: path.certificationTarget,
    track: path.track ?? 'trades',
    content_version: path.contentVersion ?? '1',
    nodes: path.nodes.map((node) => ({
      id: node.id,
      title: node.title,
      title_sw: node.titleSw,
      description: node.description,
      icon: node.icon,
      cdacc_unit_id: node.cdaccUnitId,
      exam_domain: node.examDomain,
      prerequisites: node.prerequisites,
      lesson_ids: node.lessonIds,
    })),
  };
}

mkdirSync(lessonsDir, { recursive: true });
mkdirSync(pathsDir, { recursive: true });

for (const lesson of tradeLessons) {
  writeFileSync(join(lessonsDir, `${lesson.id}.yaml`), `${dump(lessonToYaml(lesson))}\n`, 'utf8');
}

for (const path of tradePaths) {
  writeFileSync(join(pathsDir, `${path.id}.yaml`), `${dump(pathToYaml(path))}\n`, 'utf8');
}

console.log(`Wrote ${tradeLessons.length} trade lessons and ${tradePaths.length} trade paths`);
