import { useState } from 'react';
import type { Exercise } from '@cyberlearn/types';
import ExerciseRouter from '@/components/exercises/ExerciseRouter';
import { isAnswerCorrect } from '@/lib/hash';
import { useT } from '@/i18n';

export default function AutogradeTry({
  exercises,
  lessonId,
}: {
  exercises: Exercise[];
  lessonId: string;
}) {
  const t = useT();
  const autograded = exercises.filter(
    (exercise) => exercise.type === 'MULTIPLE_CHOICE' || exercise.type === 'FILL_BLANK'
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, answered: 0 });
  const [done, setDone] = useState(false);
  const current = autograded[index];

  if (!autograded.length) {
    return <p className="text-sm text-muted">{t('autogradeEmpty')}</p>;
  }

  if (done) {
    const percent = Math.round((score.correct / autograded.length) * 100);
    return (
      <div className="card space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-accent font-semibold">{t('autogradeTitle')}</p>
        <h3 className="text-xl font-bold">{t('autogradeResult')}</h3>
        <p className="text-3xl font-bold text-success">{percent}%</p>
        <p className="text-sm text-muted">
          {score.correct}/{autograded.length} {t('correct')}
        </p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setIndex(0);
            setScore({ correct: 0, answered: 0 });
            setDone(false);
          }}
        >
          {t('autogradeRetry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-accent font-semibold">{t('autogradeTitle')}</p>
        <p className="text-xs text-muted">
          {index + 1}/{autograded.length} · {score.correct} {t('correct')}
        </p>
      </div>
      <ExerciseRouter
        key={`${current.id}-${index}`}
        exercise={current}
        lessonId={lessonId}
        onAnswer={async (answer) => {
          const isCorrect = await isAnswerCorrect(answer, current.correctAnswer, current.answerHashes);
          const nextCorrect = score.correct + (isCorrect ? 1 : 0);
          const nextAnswered = score.answered + 1;
          setScore({ correct: nextCorrect, answered: nextAnswered });
          window.setTimeout(() => {
            if (index + 1 >= autograded.length) setDone(true);
            else setIndex((value) => value + 1);
          }, isCorrect ? 700 : 1000);
          return {
            isCorrect,
            xpAwarded: isCorrect ? current.xpReward : 0,
            explanation: current.explanation,
          };
        }}
      />
    </div>
  );
}
