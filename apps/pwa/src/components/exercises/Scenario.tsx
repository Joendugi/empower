import MultipleChoice from './MultipleChoice';
import type { ExerciseProps } from './types';

/** Scenario is a longer multiple-choice prompt with the same grading path. */
export default function Scenario(props: ExerciseProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-wide text-muted">Scenario</p>
      <MultipleChoice {...props} />
    </div>
  );
}
