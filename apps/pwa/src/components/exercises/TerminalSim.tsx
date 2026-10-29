import { useState, useRef, useEffect, useMemo } from 'react';
import type { ExerciseProps } from './types';
import { ShellSession } from '@/lib/sandbox/shell';
import { Terminal, CheckCircle2, CornerDownLeft } from 'lucide-react';

interface HistoryLine {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

export default function TerminalSim({ exercise, onAnswer }: ExerciseProps) {
  const shell = useMemo(() => new ShellSession(), [exercise.id]);

  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'system', text: '# CyberLearn In-Browser Linux Sandbox (Tier 1)' },
    { type: 'system', text: '# ' + exercise.prompt },
    { type: 'system', text: '# Type commands below or type "help" for a list of available utilities.' },
  ]);
  const [input, setInput] = useState('');
  const [solved, setSolved] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const responses = exercise.terminalResponses ?? {};

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed || solved) return;

    // Reset history index
    setHistoryIndex(-1);

    const promptStr = shell.getPrompt();
    const next: HistoryLine[] = [...history, { type: 'input', text: `${promptStr} ${trimmed}` }];

    // Check if exercise has an explicit override response
    const mockResponse = responses[trimmed] ?? responses[trimmed.toLowerCase()];

    if (mockResponse !== undefined) {
      next.push({ type: 'output', text: mockResponse });
    } else {
      // Execute command in our in-browser Linux Shell
      const out = await shell.execute(trimmed);
      if (out.stdout === '\x1bc') {
        // Clear screen command
        setHistory([]);
        setInput('');
        return;
      }
      if (out.stdout) {
        next.push({ type: 'output', text: out.stdout });
      }
      if (out.stderr) {
        next.push({ type: 'error', text: out.stderr });
      }
    }

    setInput('');

    // Evaluate answer with lesson grader
    const result = await onAnswer(trimmed);
    if (result.isCorrect) {
      next.push({ type: 'system', text: `\n[PASS] Challenge Solved! Awarded +${result.xpAwarded} XP` });
      setSolved(true);
    }

    setHistory(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const past = shell.commandHistory;
      if (past.length === 0) return;
      const nextIdx = historyIndex === -1 ? past.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInput(past[nextIdx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const past = shell.commandHistory;
      if (past.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= past.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIdx);
        setInput(past[nextIdx] ?? '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab autocomplete for files in current directory
      const parts = input.split(' ');
      const lastWord = parts[parts.length - 1] ?? '';
      if (!lastWord) return;

      const entries = shell.vfs.listDir(shell.cwd);
      if (entries) {
        const matches = entries.filter((ent) => ent.name.startsWith(lastWord));
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0].name;
          setInput(parts.join(' '));
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="bg-[#0b0f17] rounded-xl border border-white/[0.1] shadow-2xl overflow-hidden font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-2 text-xs font-semibold text-muted flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-accent" />
              {shell.getPrompt()}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-accent/80 font-mono bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
            WASM Sandbox
          </span>
        </div>

        <div ref={terminalRef} className="p-4 h-64 overflow-y-auto space-y-1 cursor-text select-text">
          {history.map((line, i) => (
            <div
              key={i}
              className={
                line.type === 'input'
                  ? 'text-accent font-bold'
                  : line.type === 'error'
                    ? 'text-rose-400'
                    : line.type === 'system'
                      ? 'text-amber-300/90 italic'
                      : 'text-gray-200'
              }
            >
              {line.text || '\u00A0'}
            </div>
          ))}
        </div>

        {!solved ? (
          <div className="flex items-center gap-2 px-3.5 py-2.5 border-t border-white/[0.08] bg-black/40">
            <span className="text-accent font-bold flex-shrink-0 text-xs">
              {shell.getPrompt()}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white outline-none font-mono text-xs placeholder:text-muted/60"
              placeholder="enter command (e.g. ls, cat welcome.txt, python3 script.py, help)…"
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
            <button
              type="button"
              onClick={() => handleCommand(input)}
              className="btn-primary !p-1.5 !rounded-lg text-xs"
              title="Execute command"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="px-4 py-2 bg-emerald-500/10 border-t border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Task verified and completed.</span>
          </div>
        )}
      </div>

      {exercise.hint && !solved && (
        <p className="text-xs text-muted px-1 flex items-center gap-1">
          <span className="text-accent font-semibold">Hint:</span> {exercise.hint}
        </p>
      )}
    </div>
  );
}
