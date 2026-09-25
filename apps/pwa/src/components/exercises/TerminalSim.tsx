import { useState, useRef, useEffect } from 'react';
import type { ExerciseProps } from './types';

interface HistoryLine {
  type: 'input' | 'output' | 'error';
  text: string;
}

export default function TerminalSim({ exercise, onAnswer }: ExerciseProps) {
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'output', text: '# CyberLearn Terminal' },
    { type: 'output', text: '# ' + exercise.prompt },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [solved, setSolved] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const responses = exercise.terminalResponses ?? {};

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed || solved) return;
    const next: HistoryLine[] = [...history, { type: 'input', text: `$ ${trimmed}` }];
    const response = responses[trimmed] ?? responses[trimmed.toLowerCase()];
    if (response !== undefined) next.push({ type: 'output', text: response });
    else next.push({ type: 'error', text: `bash: ${trimmed}: command not found` });
    setInput('');
    const result = await onAnswer(trimmed);
    if (result.isCorrect) {
      next.push({ type: 'output', text: `\nCorrect! +${result.xpAwarded} XP` });
      setSolved(true);
    }
    setHistory(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="bg-black rounded-xl border border-surface-light overflow-hidden font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-1.5 px-3 py-2 bg-surface border-b border-surface-light">
          <div className="w-3 h-3 rounded-full bg-danger opacity-70" />
          <div className="w-3 h-3 rounded-full bg-warning opacity-70" />
          <div className="w-3 h-3 rounded-full bg-success opacity-70" />
          <span className="ml-2 text-muted text-xs">learner@cyberlearn:~</span>
        </div>
        <div ref={terminalRef} className="p-3 h-48 overflow-y-auto space-y-0.5 cursor-text">
          {history.map((line, i) => (
            <div
              key={i}
              className={
                line.type === 'input' ? 'text-accent' : line.type === 'error' ? 'text-danger' : 'text-gray-300'
              }
            >
              {line.text || '\u00A0'}
            </div>
          ))}
        </div>
        {!solved && (
          <div className="flex items-center gap-2 px-3 py-2 border-t border-surface-light">
            <span className="text-accent flex-shrink-0">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleCommand(input);
              }}
              className="flex-1 bg-transparent text-white outline-none font-mono"
              placeholder="type a command…"
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
          </div>
        )}
      </div>
      {exercise.hint && !solved && <p className="text-xs text-muted px-1">Hint: {exercise.hint}</p>}
    </div>
  );
}
