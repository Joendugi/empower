import type { Exercise } from '@cyberlearn/types';
import type { GradeResult } from './types';
import MultipleChoice from './MultipleChoice';
import FillBlank from './FillBlank';
import TerminalSim from './TerminalSim';
import DragDrop from './DragDrop';
import MatchPairs from './MatchPairs';
import Scenario from './Scenario';
import DiagramLabel from './DiagramLabel';
import MediaPrompt from './MediaPrompt';
import PracticalCapture from './PracticalCapture';
import MediaBlock from '@/components/media/MediaBlock';

interface ExerciseRouterProps {
  exercise: Exercise;
  lessonId?: string;
  onAnswer: (answer: string | string[]) => Promise<GradeResult>;
}

export default function ExerciseRouter({ exercise, lessonId, onAnswer }: ExerciseRouterProps) {
  const props = { exercise, onAnswer };
  const practical =
    exercise.type === 'VIDEO_RECORD' || exercise.type === 'AUDIO_RECORD' || exercise.type === 'PHOTO_CAPTURE';

  const inner = (() => {
    switch (exercise.type) {
      case 'MULTIPLE_CHOICE':
        return <MultipleChoice {...props} />;
      case 'FILL_BLANK':
        return <FillBlank {...props} />;
      case 'TERMINAL_SIM':
        return <TerminalSim {...props} />;
      case 'DRAG_DROP':
        return <DragDrop {...props} />;
      case 'MATCH_PAIRS':
        return <MatchPairs {...props} />;
      case 'SCENARIO':
        return <Scenario {...props} />;
      case 'DIAGRAM_LABEL':
        return <DiagramLabel {...props} />;
      case 'MEDIA':
        return <MediaPrompt {...props} />;
      case 'VIDEO_RECORD':
      case 'AUDIO_RECORD':
      case 'PHOTO_CAPTURE':
        return (
          <PracticalCapture
            exercise={exercise}
            lessonId={lessonId ?? exercise.id}
            onAnswer={onAnswer}
          />
        );
      default:
        return (
          <div className="card text-center text-danger py-8">
            Unknown exercise type: {(exercise as Exercise).type}
          </div>
        );
    }
  })();

  return (
    <div className="space-y-4">
      {exercise.type !== 'MEDIA' && !practical && <MediaBlock assets={exercise.media} />}
      {practical && <MediaBlock assets={exercise.media} />}
      {inner}
    </div>
  );
}
