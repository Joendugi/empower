import { useState } from 'react';
import type { ExerciseProps } from './types';
import { useT } from '@/i18n';
import { clsx } from 'clsx';

export default function DragDrop({ exercise, onAnswer }: ExerciseProps) {
  const t = useT();
  const [order, setOrder] = useState(() => (exercise.dragItems ?? []).map((item) => item.id));
  const [done, setDone] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [xp, setXp] = useState(0);
  const labels = Object.fromEntries((exercise.dragItems ?? []).map((item) => [item.id, item.text]));

  const move = (index: number, direction: -1 | 1) => {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  };

  const submit = async () => {
    const result = await onAnswer(order);
    setDone(true);
    setCorrect(result.isCorrect);
    setXp(result.xpAwarded);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-white">{exercise.prompt}</p>
      <ol className="flex flex-col gap-2">
        {order.map((id, index) => (
          <li key={id} className="card flex items-center justify-between gap-3">
            <span className="text-white font-medium">
              {index + 1}. {labels[id]}
            </span>
            {!done && (
              <div className="flex gap-2">
                <button className="btn-secondary py-1 px-3 text-sm" onClick={() => move(index, -1)}>
                  ↑
                </button>
                <button className="btn-secondary py-1 px-3 text-sm" onClick={() => move(index, 1)}>
                  ↓
                </button>
              </div>
            )}
          </li>
        ))}
      </ol>
      {!done ? (
        <button className="btn-primary" onClick={() => void submit()}>
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
