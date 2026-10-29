import { Fragment, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import type { ExerciseProps } from './types';
import { useT } from '@/i18n';

type AnswerState = 'idle' | 'correct' | 'incorrect';

export default function FillBlank({ exercise, onAnswer }: ExerciseProps) {
  const t = useT();
  // Text around each ___ ; a prompt without one gets a single blank at the end.
  const segments = exercise.prompt.includes('___') ? exercise.prompt.split('___') : [exercise.prompt, ''];
  const blankCount = segments.length - 1;
  const [values, setValues] = useState<string[]>(() => Array(blankCount).fill(''));
  const [state, setState] = useState<AnswerState>('idle');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [xp, setXp] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const complete = values.every((item) => item.trim());

  const setValue = (index: number, next: string) =>
    setValues((prev) => prev.map((item, i) => (i === index ? next : item)));

  const handleSubmit = async () => {
    if (state !== 'idle' || !complete) return;
    const trimmed = values.map((item) => item.trim());
    const result = await onAnswer(blankCount === 1 ? trimmed[0] : trimmed);
    setState(result.isCorrect ? 'correct' : 'incorrect');
    setExplanation(result.explanation ?? exercise.explanation ?? null);
    setXp(result.xpAwarded);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-primary rounded-xl p-4 font-mono text-sm border border-surface-light">
        <code className="text-green-400 whitespace-pre-wrap">
          {segments.map((segment, index) => (
            <Fragment key={index}>
              {segment}
              {index < blankCount && (
                <input
                  ref={index === 0 ? inputRef : undefined}
                  type="text"
                  value={values[index]}
                  onChange={(e) => setValue(index, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void handleSubmit()}
                  disabled={state !== 'idle'}
                  className={clsx(
                    'inline-block bg-surface-light text-white px-2 py-0.5 rounded border-b-2 font-mono',
                    'focus:outline-none focus:border-accent w-32',
                    state === 'correct' && 'border-success text-success',
                    state === 'incorrect' && 'border-danger text-danger',
                    state === 'idle' && 'border-accent'
                  )}
                  placeholder="…"
                  aria-label={blankCount === 1 ? 'Fill in the blank' : `Blank ${index + 1} of ${blankCount}`}
                  autoComplete="off"
                  spellCheck={false}
                />
              )}
            </Fragment>
          ))}
        </code>
      </div>
      {state === 'idle' && (
        <button className="btn-primary w-full" onClick={() => void handleSubmit()} disabled={!complete}>
          {t('checkAnswer')}
        </button>
      )}
      <AnimatePresence>
        {state !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
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
                {t('incorrect')} {exercise.hint}
              </span>
            )}
            {explanation && <p className="mt-2 text-muted text-xs">{explanation}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
