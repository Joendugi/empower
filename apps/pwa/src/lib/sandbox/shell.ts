// ─────────────────────────────────────────────────────────
// CyberLearn — In-Browser Linux Shell & Command Engine
// ─────────────────────────────────────────────────────────

import { VirtualFileSystem } from './vfs';
import { runPythonCode } from './pyodideRunner';

export interface CommandOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class ShellSession {
  public vfs: VirtualFileSystem;
  public cwd: string;
  public user: string;
  public hostname: string;
  public env: Map<string, string>;
  public commandHistory: string[];

  constructor(vfs?: VirtualFileSystem) {
    this.vfs = vfs ?? new VirtualFileSystem();
    this.cwd = '/home/learner';
    this.user = 'learner';
    this.hostname = 'cyberlearn-node01';
    this.commandHistory = [];
    this.env = new Map([
      ['USER', 'learner'],
      ['HOME', '/home/learner'],
      ['PWD', '/home/learner'],
      ['SHELL', '/bin/bash'],
      ['TERM', 'xterm-256color'],
      ['PATH', '/usr/local/bin:/usr/bin:/bin'],
    ]);
  }

  public getPrompt(): string {
    const displayPath = this.cwd.startsWith('/home/learner')
      ? '~' + this.cwd.slice('/home/learner'.length)
      : this.cwd;
    return `${this.user}@${this.hostname}:${displayPath}$`;
  }

  /** Expand variables like $USER, $HOME, $PWD */
  private expandVariables(str: string): string {
    return str.replace(/\$([A-Za-z0-9_]+)/g, (_match, varName) => {
      if (varName === 'PWD') return this.cwd;
      return this.env.get(varName) ?? '';
    });
  }

  /** Split line into arguments respecting single and double quotes */
  private parseArgs(commandStr: string): string[] {
    const args: string[] = [];
    let current = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;

    for (let i = 0; i < commandStr.length; i++) {
      const c = commandStr[i];
      if (c === "'" && !inDoubleQuote) {
        inSingleQuote = !inSingleQuote;
      } else if (c === '"' && !inSingleQuote) {
        inDoubleQuote = !inDoubleQuote;
      } else if (c === ' ' && !inSingleQuote && !inDoubleQuote) {
        if (current.length > 0) {
          args.push(current);
          current = '';
        }
      } else {
        current += c;
      }
    }
    if (current.length > 0) {
      args.push(current);
    }
    return args;
  }

  /** Execute a single command or pipeline string */
  public async execute(rawCommandLine: string): Promise<CommandOutput> {
    const trimmed = rawCommandLine.trim();
    if (!trimmed) {
      return { stdout: '', stderr: '', exitCode: 0 };
    }

    this.commandHistory.push(trimmed);

    // Handle pipeline: cmd1 | cmd2
    if (trimmed.includes('|')) {
      const stages = trimmed.split('|').map((s) => s.trim());
      let currentInput = '';
      for (const stage of stages) {
        const res = await this.executeSingle(stage, currentInput);
        if (res.exitCode !== 0) return res;
        currentInput = res.stdout;
      }
      return { stdout: currentInput, stderr: '', exitCode: 0 };
    }

    return this.executeSingle(trimmed);
  }

  /** Execute a single command stage with optional piped stdin */
  private async executeSingle(commandStage: string, stdinText = ''): Promise<CommandOutput> {
    let clean = this.expandVariables(commandStage);

    // Check redirection: > or >>
    let redirectPath: string | null = null;
    let appendRedirect = false;

    if (clean.includes('>>')) {
      const parts = clean.split('>>');
      clean = parts[0].trim();
      redirectPath = parts[1].trim();
      appendRedirect = true;
    } else if (clean.includes('>')) {
      const parts = clean.split('>');
      clean = parts[0].trim();
      redirectPath = parts[1].trim();
      appendRedirect = false;
    }

    const args = this.parseArgs(clean);
    if (args.length === 0) return { stdout: '', stderr: '', exitCode: 0 };

    const cmd = args[0];
    const cmdArgs = args.slice(1);

    const result = await this.dispatchCommand(cmd, cmdArgs, stdinText);

    // If redirected to file
    if (redirectPath) {
      const targetResolved = this.vfs.resolve(this.cwd, redirectPath);
      if (appendRedirect) {
        this.vfs.appendFile(targetResolved, result.stdout);
      } else {
        this.vfs.writeFile(targetResolved, result.stdout);
      }
      return { stdout: '', stderr: result.stderr, exitCode: result.exitCode };
    }

    return result;
  }

  private async dispatchCommand(
    cmd: string,
    args: string[],
    stdinText: string
  ): Promise<CommandOutput> {
    switch (cmd) {
      case 'pwd':
        return { stdout: this.cwd, stderr: '', exitCode: 0 };

      case 'whoami':
        return { stdout: this.user, stderr: '', exitCode: 0 };

      case 'hostname':
        return { stdout: this.hostname, stderr: '', exitCode: 0 };

      case 'date':
        return { stdout: new Date().toUTCString(), stderr: '', exitCode: 0 };

      case 'uptime':
        return {
          stdout: ' 12:45:00 up 42 days, 3 users,  load average: 0.12, 0.08, 0.05',
          stderr: '',
          exitCode: 0,
        };

      case 'uname':
        if (args.includes('-a')) {
          return {
            stdout: 'Linux cyberlearn-node01 6.6.0-rebuild-x86_64 #1 SMP PREEMPT Wed Oct 10 2031 x86_64 GNU/Linux',
            stderr: '',
            exitCode: 0,
          };
        }
        return { stdout: 'Linux', stderr: '', exitCode: 0 };

      case 'id':
        return {
          stdout: `uid=1000(${this.user}) gid=1000(${this.user}) groups=1000(${this.user}),27(sudo)`,
          stderr: '',
          exitCode: 0,
        };

      case 'cd': {
        const dest = args[0] ? this.vfs.resolve(this.cwd, args[0]) : '/home/learner';
        const node = this.vfs.getNode(dest);
        if (!node) {
          return { stdout: '', stderr: `cd: ${args[0]}: No such file or directory`, exitCode: 1 };
        }
        if (node.type !== 'dir') {
          return { stdout: '', stderr: `cd: ${args[0]}: Not a directory`, exitCode: 1 };
        }
        this.cwd = dest;
        this.env.set('PWD', dest);
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'ls': {
        const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
        const showLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
        const targetPath = args.find((a) => !a.startsWith('-')) ?? '.';
        const resolved = this.vfs.resolve(this.cwd, targetPath);

        const node = this.vfs.getNode(resolved);
        if (!node) {
          return { stdout: '', stderr: `ls: cannot access '${targetPath}': No such file or directory`, exitCode: 2 };
        }

        if (node.type === 'file') {
          return { stdout: node.name, stderr: '', exitCode: 0 };
        }

        const entries = this.vfs.listDir(resolved);
        if (!entries) return { stdout: '', stderr: '', exitCode: 0 };

        const filtered = showHidden ? entries : entries.filter((e) => !e.name.startsWith('.'));

        if (showLong) {
          const lines = filtered.map((e) => {
            const sizeStr = String(e.size).padStart(6, ' ');
            const dateStr = e.mtime.toLocaleDateString('en-GB', { month: 'short', day: '2-digit' });
            return `${e.permissionsString} 1 ${e.owner} ${e.group} ${sizeStr} ${dateStr} ${e.name}`;
          });
          return { stdout: `total ${filtered.length * 4}\n` + lines.join('\n'), stderr: '', exitCode: 0 };
        }

        return { stdout: filtered.map((e) => e.name).join('  '), stderr: '', exitCode: 0 };
      }

      case 'cat': {
        if (args.length === 0) {
          return { stdout: stdinText, stderr: '', exitCode: 0 };
        }
        const outputs: string[] = [];
        for (const arg of args) {
          if (arg.startsWith('-')) continue;
          const resolved = this.vfs.resolve(this.cwd, arg);
          const content = this.vfs.readFile(resolved);
          if (content === null) {
            return { stdout: '', stderr: `cat: ${arg}: No such file or directory`, exitCode: 1 };
          }
          outputs.push(content.trimEnd());
        }
        return { stdout: outputs.join('\n'), stderr: '', exitCode: 0 };
      }

      case 'grep': {
        const caseInsensitive = args.includes('-i');
        const invert = args.includes('-v');
        const lineNumbers = args.includes('-n');

        const nonFlags = args.filter((a) => !a.startsWith('-'));
        if (nonFlags.length === 0) {
          return { stdout: '', stderr: 'grep: missing pattern', exitCode: 2 };
        }

        const pattern = nonFlags[0];
        const filePath = nonFlags[1];

        let content = stdinText;
        if (filePath) {
          const resolved = this.vfs.resolve(this.cwd, filePath);
          const fileContent = this.vfs.readFile(resolved);
          if (fileContent === null) {
            return { stdout: '', stderr: `grep: ${filePath}: No such file or directory`, exitCode: 2 };
          }
          content = fileContent;
        }

        const regex = new RegExp(pattern, caseInsensitive ? 'i' : '');
        const lines = content.split('\n');
        const matched: string[] = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (!line && i === lines.length - 1) continue;
          const isMatch = regex.test(line);
          const pass = invert ? !isMatch : isMatch;
          if (pass) {
            matched.push(lineNumbers ? `${i + 1}:${line}` : line);
          }
        }

        return {
          stdout: matched.join('\n'),
          stderr: '',
          exitCode: matched.length > 0 ? 0 : 1,
        };
      }

      case 'echo': {
        const text = args.join(' ');
        return { stdout: text, stderr: '', exitCode: 0 };
      }

      case 'touch': {
        for (const arg of args) {
          const resolved = this.vfs.resolve(this.cwd, arg);
          if (!this.vfs.exists(resolved)) {
            this.vfs.writeFile(resolved, '');
          }
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'mkdir': {
        for (const arg of args) {
          if (arg.startsWith('-')) continue;
          const resolved = this.vfs.resolve(this.cwd, arg);
          this.vfs.mkdirp(resolved);
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'rm': {
        const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-fr');
        const targets = args.filter((a) => !a.startsWith('-'));
        for (const t of targets) {
          const resolved = this.vfs.resolve(this.cwd, t);
          this.vfs.unlink(resolved, recursive);
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'chmod': {
        if (args.length < 2) {
          return { stdout: '', stderr: 'chmod: missing operand', exitCode: 1 };
        }
        const modeArg = args[0];
        const targetPath = this.vfs.resolve(this.cwd, args[1]);

        let numericMode = 0o644;
        if (/^[0-7]{3,4}$/.test(modeArg)) {
          numericMode = parseInt(modeArg, 8);
        } else if (modeArg === '+x') {
          numericMode = 0o755;
        } else if (modeArg === '-x') {
          numericMode = 0o644;
        }

        const ok = this.vfs.chmod(targetPath, numericMode);
        if (!ok) {
          return { stdout: '', stderr: `chmod: cannot access '${args[1]}': No such file`, exitCode: 1 };
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'wc': {
        const countLines = args.includes('-l');
        const filePath = args.find((a) => !a.startsWith('-'));
        let text = stdinText;
        if (filePath) {
          const resolved = this.vfs.resolve(this.cwd, filePath);
          const c = this.vfs.readFile(resolved);
          if (c === null) {
            return { stdout: '', stderr: `wc: ${filePath}: No such file`, exitCode: 1 };
          }
          text = c;
        }
        const lines = text.split('\n').filter((l) => l.length > 0).length;
        const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
        const bytes = new TextEncoder().encode(text).length;

        if (countLines) {
          return { stdout: `${lines}${filePath ? ' ' + filePath : ''}`, stderr: '', exitCode: 0 };
        }
        return { stdout: `${lines} ${words} ${bytes}${filePath ? ' ' + filePath : ''}`, stderr: '', exitCode: 0 };
      }

      case 'base64': {
        const decode = args.includes('-d') || args.includes('--decode');
        const targetFile = args.find((a) => !a.startsWith('-'));
        let inputStr = stdinText;
        if (targetFile) {
          const resolved = this.vfs.resolve(this.cwd, targetFile);
          const c = this.vfs.readFile(resolved);
          if (c === null) return { stdout: '', stderr: `base64: ${targetFile}: No such file`, exitCode: 1 };
          inputStr = c.trim();
        }
        try {
          if (decode) {
            const decoded = atob(inputStr);
            return { stdout: decoded, stderr: '', exitCode: 0 };
          }
          const encoded = btoa(inputStr);
          return { stdout: encoded, stderr: '', exitCode: 0 };
        } catch {
          return { stdout: '', stderr: 'base64: invalid input', exitCode: 1 };
        }
      }

      case 'sha256sum': {
        const targetFile = args[0];
        let text = stdinText;
        if (targetFile) {
          const resolved = this.vfs.resolve(this.cwd, targetFile);
          const c = this.vfs.readFile(resolved);
          if (c === null) {
            return { stdout: '', stderr: `sha256sum: ${targetFile}: No such file`, exitCode: 1 };
          }
          text = c;
        }
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuf = await crypto.subtle.digest('SHA-256', data);
        const hex = Array.from(new Uint8Array(hashBuf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        return { stdout: `${hex}  ${targetFile ?? '-'}`, stderr: '', exitCode: 0 };
      }

      case 'ping': {
        const host = args.find((a) => !a.startsWith('-')) ?? '8.8.8.8';
        return {
          stdout: [
            `PING ${host} (${host}) 56(84) bytes of data.`,
            `64 bytes from ${host}: icmp_seq=1 ttl=116 time=14.2 ms`,
            `64 bytes from ${host}: icmp_seq=2 ttl=116 time=13.8 ms`,
            `64 bytes from ${host}: icmp_seq=3 ttl=116 time=14.0 ms`,
            `--- ${host} ping statistics ---`,
            `3 packets transmitted, 3 received, 0% packet loss, time 2003ms`,
          ].join('\n'),
          stderr: '',
          exitCode: 0,
        };
      }

      case 'curl': {
        const url = args.find((a) => !a.startsWith('-')) ?? 'http://localhost';
        return {
          stdout: `HTTP/1.1 200 OK\nServer: CyberLearn Edge Gateway\nContent-Type: application/json\n\n{"status":"online","url":"${url}","gateway":"Nairobi-Central-01","ping_ms":12}`,
          stderr: '',
          exitCode: 0,
        };
      }

      case 'python':
      case 'python3': {
        let code = '';
        if (args.includes('-c')) {
          const cIdx = args.indexOf('-c');
          code = args.slice(cIdx + 1).join(' ');
        } else if (args.length > 0) {
          const scriptPath = this.vfs.resolve(this.cwd, args[0]);
          const fileContent = this.vfs.readFile(scriptPath);
          if (fileContent === null) {
            return { stdout: '', stderr: `python3: can't open file '${args[0]}': No such file`, exitCode: 2 };
          }
          code = fileContent;
        } else {
          return {
            stdout: 'Python 3.12 (CyberLearn WebAssembly Shell)\nUse python3 script.py or python3 -c "code"',
            stderr: '',
            exitCode: 0,
          };
        }

        const pyResult = await runPythonCode(code, this.vfs);
        return {
          stdout: pyResult.stdout,
          stderr: pyResult.stderr,
          exitCode: pyResult.exitCode,
        };
      }

      case 'clear':
        return { stdout: '\x1bc', stderr: '', exitCode: 0 };

      case 'help':
        return {
          stdout: [
            'CyberLearn In-Browser Linux Environment (Tier 1)',
            'Available commands:',
            '  File & Dir:   ls, cd, pwd, cat, touch, mkdir, rm, chmod, wc, grep, base64, sha256sum',
            '  Network:      ping, curl',
            '  System:       whoami, id, hostname, uname -a, date, uptime, clear, help',
            '  Scripting:    python3 script.py, python3 -c "print(1+1)"',
            '  Operators:    Pipes (|), file redirection (> and >>), environment vars ($USER, $PWD)',
          ].join('\n'),
          stderr: '',
          exitCode: 0,
        };

      default:
        return {
          stdout: '',
          stderr: `bash: ${cmd}: command not found. Type 'help' for available commands.`,
          exitCode: 127,
        };
    }
  }
}
