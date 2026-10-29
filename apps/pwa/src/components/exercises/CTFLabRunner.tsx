import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Cpu, 
  Flag
} from 'lucide-react';
import { ShellSession } from '@/lib/sandbox/shell';
import { api, ApiError } from '@/lib/api';

export interface CTFChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  points: number;
  description: string;
  launchUrl?: string;
  initialFiles?: Record<string, string>;
  expectedFlag?: string;
}

interface CTFLabRunnerProps {
  challenge: CTFChallenge;
  onSolve?: (flag: string, pointsAwarded: number) => void;
  language?: string;
}

interface TerminalLog {
  type: 'prompt' | 'stdout' | 'stderr' | 'system';
  content: string;
}

export const CTFLabRunner: React.FC<CTFLabRunnerProps> = ({
  challenge,
  onSolve,
  language = 'en',
}) => {
  const isSw = language === 'sw';
  const shell = useMemo(() => new ShellSession(), [challenge.id]);

  const [logs, setLogs] = useState<TerminalLog[]>([
    { type: 'system', content: `[CTF SANDBOX] Initialized target container for: ${challenge.title}` },
    { type: 'system', content: `[BRIEFING] ${challenge.description}` },
    { type: 'system', content: `[INFO] Explore the virtual filesystem to discover the hidden flag. Format: flag{...}` },
  ]);

  const [commandInput, setCommandInput] = useState('');
  const [flagInput, setFlagInput] = useState('');
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [flagStatus, setFlagStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-seed Virtual File System based on challenge
  useEffect(() => {
    if (challenge.id === 'ctf-linux-perms-01') {
      shell.vfs.writeFile('/home/learner/notes.txt', 'Reminder: check /var/backups/dispatch.conf for system tokens.');
      shell.vfs.mkdirp('/var/backups');
      shell.vfs.writeFile(
        '/var/backups/dispatch.conf',
        '# SCADA DISPATCH CONFIGURATION\nSTATION_ID=NAIROBI-SUB04\nAUTH_FLAG=flag{scada_file_perms_restored_2031}\nSTATUS=REBUILD_ONLINE'
      );
    } else if (challenge.id === 'ctf-web-sqli-01') {
      shell.vfs.writeFile(
        '/home/learner/sqli_query.sql',
        "SELECT * FROM admin_users WHERE username = 'admin' AND password = '' OR '1'='1' --';"
      );
      shell.vfs.writeFile(
        '/home/learner/portal_dump.csv',
        'id,username,role,flag\n1,admin,CorpsCommander,flag{nuller_gate_sqli_bypassed}\n2,operator,Technician,NULL'
      );
    } else if (challenge.id === 'ctf-pcap-recon-01') {
      shell.vfs.writeFile(
        '/home/learner/traffic_summary.txt',
        'IP Packet Analysis:\nSrc: 192.168.1.45 -> Dst: 102.219.208.12 [C2 Command Beacon]\nPayload Token: flag{wireshark_c2_beacon_intercepted}'
      );
    }
  }, [challenge.id, shell]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [logs]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    const promptText = shell.getPrompt();
    setLogs((prev) => [...prev, { type: 'prompt', content: `${promptText} ${cmd}` }]);
    setCommandInput('');

    if (cmd === 'clear') {
      setLogs([]);
      return;
    }

    const res = await shell.execute(cmd);
    if (res.stdout) {
      setLogs((prev) => [...prev, { type: 'stdout', content: res.stdout }]);
    }
    if (res.stderr) {
      setLogs((prev) => [...prev, { type: 'stderr', content: res.stderr }]);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const flag = flagInput.trim();
    if (!flag) return;

    setIsSubmittingFlag(true);
    setStatusMessage(null);

    try {
      const data = await api<{ status: 'correct' | 'already_solved' | 'incorrect'; points: number }>('/ctfd/solve', {
        method: 'POST',
        body: JSON.stringify({ challengeId: challenge.id, flag }),
      });
      if (data.status === 'already_solved') {
        setFlagStatus('correct');
        setStatusMessage(isSw ? 'Umeshakamilisha shindano hili hapo awali!' : 'Challenge already solved!');
      } else if (data.status === 'correct') {
        setFlagStatus('correct');
        setStatusMessage(isSw ? `Bendera sahihi! Umepata +${data.points} XP!` : `Flag accepted! Awarded +${data.points} XP!`);
        onSolve?.(flag, data.points);
      } else {
        setFlagStatus('incorrect');
        setStatusMessage(isSw ? 'Bendera si sahihi. Jaribu tena!' : 'Incorrect flag. Check the files and try again!');
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setFlagStatus('idle');
        setStatusMessage(isSw ? 'Ingia ili kuhifadhi XP yako.' : 'Sign in to submit flags and earn XP.');
        return;
      }
      // Offline fallback verification
      const knownFlags: Record<string, string> = {
        'ctf-linux-perms-01': 'flag{scada_file_perms_restored_2031}',
        'ctf-web-sqli-01': 'flag{nuller_gate_sqli_bypassed}',
        'ctf-pcap-recon-01': 'flag{wireshark_c2_beacon_intercepted}',
      };

      if (knownFlags[challenge.id] && knownFlags[challenge.id] === flag) {
        setFlagStatus('correct');
        setStatusMessage(isSw ? `Bendera sahihi! Umepata +${challenge.points} XP!` : `Flag accepted! Awarded +${challenge.points} XP!`);
        onSolve?.(flag, challenge.points);
      } else {
        setFlagStatus('incorrect');
        setStatusMessage(isSw ? 'Bendera si sahihi.' : 'Incorrect flag. Try inspecting other directories.');
      }
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  return (
    <div className="card bg-black/90 border border-surface-light/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-4">
      {/* Target Container Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-surface-light/30 bg-surface-dark/70">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono">{challenge.title}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase bg-emerald-500/20 text-emerald-300 font-bold">
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-[11px] text-muted font-mono">{challenge.category} · {challenge.points} PTS</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {flagStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SOLVED
            </span>
          )}
        </div>
      </div>

      {/* Embedded Terminal Screen */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="p-4 bg-black/95 font-mono text-xs text-white/90 h-64 overflow-y-auto space-y-1.5 select-text cursor-text"
      >
        {logs.map((log, i) => (
          <div key={i} className="leading-relaxed">
            {log.type === 'prompt' && <span className="text-emerald-400">{log.content}</span>}
            {log.type === 'stdout' && <span className="text-slate-200 whitespace-pre-wrap">{log.content}</span>}
            {log.type === 'stderr' && <span className="text-red-400 whitespace-pre-wrap">{log.content}</span>}
            {log.type === 'system' && <span className="text-muted/80 italic">{log.content}</span>}
          </div>
        ))}

        {/* Live Input Line */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 shrink-0">{shell.getPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs focus:ring-0 p-0"
            autoFocus
          />
        </form>
      </div>

      {/* Flag Capture Submitter Panel */}
      <div className="p-4 bg-surface-dark border-t border-surface-light/30">
        <form onSubmit={handleFlagSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <Flag className="w-4 h-4 text-emerald-400" />
            </div>
            <input
              type="text"
              required
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="Enter captured flag (e.g. flag{...})"
              disabled={flagStatus === 'correct'}
              className="w-full bg-black/60 border border-surface-light/60 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-mono text-white placeholder:text-muted/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmittingFlag || !flagInput.trim() || flagStatus === 'correct'}
            className="btn-primary !bg-emerald-500 !text-black !hover:bg-emerald-400 py-2.5 px-5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
          >
            {isSubmittingFlag ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : flagStatus === 'correct' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submitted</span>
              </>
            ) : (
              <>
                <Flag className="w-4 h-4" />
                <span>Submit Flag</span>
              </>
            )}
          </button>
        </form>

        {statusMessage && (
          <div className={`mt-2 text-xs flex items-center gap-1.5 font-mono ${flagStatus === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
            {flagStatus === 'correct' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
