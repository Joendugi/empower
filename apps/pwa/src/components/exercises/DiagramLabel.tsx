import { useState } from 'react';
import type { ExerciseProps } from './types';
import VehicleAnatomy, { type AnatomyKind } from '@/components/anatomy/VehicleAnatomy';
import { useT } from '@/i18n';
import { clsx } from 'clsx';

const anatomyKinds: AnatomyKind[] = ['overview', 'engine', 'cooling', 'drivetrain', 'brakes', 'electrical'];

export default function DiagramLabel({ exercise, onAnswer }: ExerciseProps) {
  const t = useT();
  const slots = exercise.diagramSlots ?? [];
  const labels = exercise.options ?? slots.map((slot) => ({ id: slot.id, text: slot.label }));
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [xp, setXp] = useState(0);

  const place = (slotId: string) => {
    if (done || !selectedLabel) return;
    setPlaced((prev) => ({ ...prev, [slotId]: selectedLabel }));
    setSelectedLabel(null);
  };

  const submit = async () => {
    const payload = Object.entries(placed).map(([slot, label]) => `${slot}=${label}`);
    const result = await onAnswer(payload);
    setDone(true);
    setCorrect(result.isCorrect);
    setXp(result.xpAwarded);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-white">{exercise.prompt}</p>
      <div className="relative rounded-2xl bg-primary border border-surface-light overflow-hidden min-h-48">
        {anatomyKinds.includes(exercise.diagramKind as AnatomyKind) ? (
          <VehicleAnatomy kind={exercise.diagramKind as AnatomyKind} labeled={false} />
        ) : null}
        {slots.map((slot) => (
          <button
            key={slot.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs bg-surface-light text-white border border-accent/40"
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            onClick={() => place(slot.id)}
            disabled={done}
          >
            {placed[slot.id]
              ? labels.find((label) => label.id === placed[slot.id])?.text ?? slot.label
              : slot.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <button
            key={label.id}
            className={clsx('btn-secondary py-2 px-3 text-sm', selectedLabel === label.id && 'border-accent')}
            onClick={() => setSelectedLabel(label.id)}
            disabled={done}
          >
            {label.text}
          </button>
        ))}
      </div>
      {!done ? (
        <button className="btn-primary" onClick={() => void submit()} disabled={Object.keys(placed).length < slots.length}>
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
