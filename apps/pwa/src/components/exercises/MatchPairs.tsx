import { useMemo, useState } from 'react';
import type { ExerciseProps } from './types';
import { useT } from '@/i18n';
import { clsx } from 'clsx';

export default function MatchPairs({ exercise, onAnswer }: ExerciseProps) {
  const t = useT();
  const pairs = exercise.pairs ?? [];
  const left = pairs.map((pair) => pair.left);
  const right = useMemo(
    () => [...pairs.map((pair) => pair.right)].sort((a, b) => a.text.localeCompare(b.text)),
    [pairs]
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [xp, setXp] = useState(0);

  const onLeft = (id: string) => {
    if (done) return;
    setSelectedLeft(id);
  };

  const onRight = (id: string) => {
    if (done || !selectedLeft) return;
    setMatches((prev) => ({ ...prev, [selectedLeft]: id }));
    setSelectedLeft(null);
  };

  const submit = async () => {
    const payload = Object.entries(matches).map(([l, r]) => `${l}=${r}`);
    const result = await onAnswer(payload);
    setDone(true);
    setCorrect(result.isCorrect);
    setXp(result.xpAwarded);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-white">{exercise.prompt}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {left.map((item) => (
            <button
              key={item.id}
              className={clsx(
                'exercise-option',
                selectedLeft === item.id && 'border-accent',
                matches[item.id] && 'exercise-option--correct'
              )}
              onClick={() => onLeft(item.id)}
              disabled={done}
            >
              {item.text}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {right.map((item) => (
            <button
              key={item.id}
              className="exercise-option"
              onClick={() => onRight(item.id)}
              disabled={done}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
      {!done ? (
        <button className="btn-primary" onClick={() => void submit()} disabled={Object.keys(matches).length < left.length}>
          {t('checkAnswer')}
        </button>
      ) : (
        <p className={clsx('text-sm font-medium', correct ? 'text-success' : 'text-danger')}>
          {correct ? `${t('correct')} +${xp} XP` : t('incorrect')}
        </p>
      )}
    </div>
  );
}
