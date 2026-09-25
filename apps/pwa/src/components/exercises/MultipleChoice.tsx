import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import type { ExerciseProps } from './types';
import { useT } from '@/i18n';

type AnswerState = 'idle' | 'correct' | 'incorrect';

export default function MultipleChoice({ exercise, onAnswer }: ExerciseProps) {
  const t = useT();
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<AnswerState>('idle');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [xp, setXp] = useState(0);

  const handleSelect = async (optionId: string) => {
    if (state !== 'idle') return;
    setSelected(optionId);
    const result = await onAnswer(optionId);
    setState(result.isCorrect ? 'correct' : 'incorrect');
    setExplanation(result.explanation ?? exercise.explanation ?? null);
    setXp(result.xpAwarded);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-white leading-relaxed">{exercise.prompt}</p>
      <div className="flex flex-col gap-3">
        {(exercise.options ?? []).map((option) => {
          const isSelected = selected === option.id;
          return (
            <motion.button
              key={option.id}
              className={clsx(
                'exercise-option',
                state !== 'idle' && isSelected && state === 'correct' && 'exercise-option--correct',
                state !== 'idle' && isSelected && state === 'incorrect' && 'exercise-option--incorrect'
              )}
              onClick={() => void handleSelect(option.id)}
              disabled={state !== 'idle'}
              aria-pressed={isSelected}
            >
              {option.text}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {state !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              'p-4 rounded-xl text-sm font-medium',
              state === 'correct'
                ? 'bg-success/10 border border-success/30 text-success'
                : 'bg-danger/10 border border-danger/30 text-danger'
            )}
          >
            {state === 'correct' ? (
              <span>
                {t('correct')} +{xp} XP
              </span>
            ) : (
              <span>
                {t('incorrect')} {exercise.hint ? <span className="text-muted">{exercise.hint}</span> : null}
              </span>
            )}
            {explanation && <p className="mt-2 text-muted text-xs">{explanation}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
