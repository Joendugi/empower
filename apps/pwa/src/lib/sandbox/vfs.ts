// ─────────────────────────────────────────────────────────
// CyberLearn — In-Browser Virtual Unix Filesystem (VFS)
// ─────────────────────────────────────────────────────────

export interface VfsFile {
  type: 'file';
  name: string;
  content: string;
  mode: number; // e.g. 0o644, 0o755
  owner: string;
  group: string;
  mtime: number;
}

export interface VfsDirectory {
  type: 'dir';
  name: string;
  mode: number; // e.g. 0o755
  owner: string;
  group: string;
  mtime: number;
  entries: Map<string, VfsNode>;
}

export type VfsNode = VfsFile | VfsDirectory;

export interface StatInfo {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
  size: number;
  mode: number;
  owner: string;
  group: string;
  mtime: Date;
  permissionsString: string;
}

function modeToString(mode: number, isDir: boolean): string {
  const typeChar = isDir ? 'd' : '-';
  const perms = [
    (mode & 0o400) ? 'r' : '-',
    (mode & 0o200) ? 'w' : '-',
    (mode & 0o100) ? 'x' : '-',
    (mode & 0o040) ? 'r' : '-',
    (mode & 0o020) ? 'w' : '-',
    (mode & 0o010) ? 'x' : '-',
    (mode & 0o004) ? 'r' : '-',
    (mode & 0o002) ? 'w' : '-',
    (mode & 0o001) ? 'x' : '-',
  ];
  return typeChar + perms.join('');
}

export class VirtualFileSystem {
  private root: VfsDirectory;

  constructor() {
    this.root = {
      type: 'dir',
      name: '',
      mode: 0o755,
      owner: 'root',
      group: 'root',
      mtime: Date.now(),
      entries: new Map(),
    };
    this.initDefaultTree();
  }

  /** Populate standard Linux filesystem structure with realistic learning files */
  private initDefaultTree() {
    this.mkdirp('/bin', 0o755, 'root');
    this.mkdirp('/etc', 0o755, 'root');
    this.mkdirp('/home/learner', 0o755, 'learner');
    this.mkdirp('/var/log', 0o755, 'root');
    this.mkdirp('/tmp', 0o777, 'root');

    // System info in /etc
    this.writeFile(
      '/etc/hostname',
      'cyberlearn-node01\n',
      0o644,
      'root'
    );
    this.writeFile(
      '/etc/os-release',
      'NAME="CyberLearn Linux (Alpine / Debian Hybrid)"\nVERSION="2031.1 (Rebuild Edition)"\nID=cyberlearn\n',
      0o644,
      'root'
    );
    this.writeFile(
      '/etc/passwd',
      'root:x:0:0:root:/root:/bin/bash\nlearner:x:1000:1000:Rebuilder Recruit:/home/learner:/bin/bash\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin\n',
      0o644,
      'root'
    );
    this.writeFile(
      '/etc/resolv.conf',
      'nameserver 1.1.1.1\nnameserver 8.8.8.8\nsearch local.ke\n',
      0o644,
      'root'
    );

    // Realistic authentication log in /var/log/auth.log for log-analysis & grep exercises
    this.writeFile(
      '/var/log/auth.log',
      [
        'Oct 10 08:12:01 cyberlearn sshd[1402]: Accepted publickey for learner from 192.168.1.50 port 54220 ssh2',
        'Oct 10 08:15:22 cyberlearn sshd[1410]: Failed password for invalid user admin from 102.214.34.12 port 41102 ssh2',
        'Oct 10 08:15:24 cyberlearn sshd[1412]: Failed password for invalid user root from 102.214.34.12 port 41104 ssh2',
        'Oct 10 08:15:26 cyberlearn sshd[1415]: Failed password for invalid user test from 102.214.34.12 port 41106 ssh2',
        'Oct 10 08:15:28 cyberlearn sshd[1418]: Connection closed by authenticating user admin 102.214.34.12 port 41102 [preauth]',
        'Oct 10 08:16:00 cyberlearn sudo:   learner : TTY=pts/0 ; PWD=/home/learner ; USER=root ; COMMAND=/usr/bin/apt update',
        'Oct 10 08:20:11 cyberlearn sshd[1488]: Accepted password for learner from 192.168.1.50 port 54238 ssh2',
      ].join('\n') + '\n',
      0o644,
      'root'
    );

    // Initial learner workspace files in /home/learner
    this.writeFile(
      '/home/learner/welcome.txt',
      'Welcome to CyberLearn Sandbox.\nType "help" to view available shell commands.\nYou have a virtual Linux environment running client-side in your browser.\n',
      0o644,
      'learner'
    );

    this.writeFile(
      '/home/learner/script.py',
      '# CyberLearn Python Practice\nimport hashlib\n\nsecret = "Rebuild2031"\nh = hashlib.sha256(secret.encode()).hexdigest()\nprint(f"SHA-256 hash of {secret}: {h}")\n',
      0o755,
      'learner'
    );
  }

  /** Normalize and split path string into clean segment array */
  private splitPath(path: string): string[] {
    return path
      .split('/')
      .filter((p) => p.length > 0 && p !== '.');
  }

  /** Resolve relative paths against working directory */
  public resolve(cwd: string, targetPath: string): string {
    let cleanTarget = targetPath.trim();
    if (cleanTarget.startsWith('~')) {
      cleanTarget = '/home/learner' + cleanTarget.slice(1);
    }
    const isAbsolute = cleanTarget.startsWith('/');
    const baseSegments = isAbsolute ? [] : this.splitPath(cwd);
    const targetSegments = this.splitPath(cleanTarget);

    const result: string[] = [...baseSegments];
    for (const segment of targetSegments) {
      if (segment === '..') {
        if (result.length > 0) result.pop();
      } else {
        result.push(segment);
      }
    }
    return '/' + result.join('/');
  }

  /** Traverse down to parent directory of path */
  private traverse(path: string, createMissingDirs = false): { dir: VfsDirectory; name: string } | null {
    const segments = this.splitPath(path);
    if (segments.length === 0) return { dir: this.root, name: '' };

    let current = this.root;
    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i];
      let next = current.entries.get(seg);
      if (!next) {
        if (createMissingDirs) {
          next = {
            type: 'dir',
            name: seg,
            mode: 0o755,
            owner: 'learner',
            group: 'learner',
            mtime: Date.now(),
            entries: new Map(),
          };
          current.entries.set(seg, next);
        } else {
          return null;
        }
      }
      if (next.type !== 'dir') return null;
      current = next;
    }
    return { dir: current, name: segments[segments.length - 1] };
  }

  public getNode(path: string): VfsNode | null {
    const segments = this.splitPath(path);
    if (segments.length === 0) return this.root;
    const trav = this.traverse(path);
    if (!trav) return null;
    return trav.dir.entries.get(trav.name) ?? null;
  }

  public exists(path: string): boolean {
    return this.getNode(path) !== null;
  }

  public readFile(path: string): string | null {
    const node = this.getNode(path);
    if (!node || node.type !== 'file') return null;
    return node.content;
  }

  public writeFile(path: string, content: string, mode = 0o644, owner = 'learner'): boolean {
    const trav = this.traverse(path, true);
    if (!trav) return false;
    const fileNode: VfsFile = {
      type: 'file',
      name: trav.name,
      content,
      mode,
      owner,
      group: owner,
      mtime: Date.now(),
    };
    trav.dir.entries.set(trav.name, fileNode);
    return true;
  }

  public appendFile(path: string, content: string, owner = 'learner'): boolean {
    const existing = this.readFile(path);
    const newContent = (existing ?? '') + content;
    return this.writeFile(path, newContent, 0o644, owner);
  }

  public mkdirp(path: string, mode = 0o755, owner = 'learner'): boolean {
    const segments = this.splitPath(path);
    let current = this.root;
    for (const seg of segments) {
      let next = current.entries.get(seg);
      if (!next) {
        next = {
          type: 'dir',
          name: seg,
          mode,
          owner,
          group: owner,
          mtime: Date.now(),
          entries: new Map(),
        };
        current.entries.set(seg, next);
      } else if (next.type !== 'dir') {
        return false;
      }
      current = next;
    }
    return true;
  }

  public unlink(path: string, recursive = false): boolean {
    const trav = this.traverse(path);
    if (!trav) return false;
    const target = trav.dir.entries.get(trav.name);
    if (!target) return false;
    if (target.type === 'dir' && !recursive && target.entries.size > 0) {
      return false; // Directory not empty
    }
    return trav.dir.entries.delete(trav.name);
  }

  public listDir(path: string): StatInfo[] | null {
    const node = this.getNode(path);
    if (!node || node.type !== 'dir') return null;
    const result: StatInfo[] = [];
    for (const [name, child] of node.entries.entries()) {
      const isDir = child.type === 'dir';
      const size = isDir ? child.entries.size * 64 : (child as VfsFile).content.length;
      result.push({
        name,
        isDirectory: isDir,
        isFile: !isDir,
        size,
        mode: child.mode,
        owner: child.owner,
        group: child.group,
        mtime: new Date(child.mtime),
        permissionsString: modeToString(child.mode, isDir),
      });
    }
    // Sort directories first, then alphabetical
    result.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    return result;
  }

  public chmod(path: string, mode: number): boolean {
    const node = this.getNode(path);
    if (!node) return false;
    node.mode = mode;
    return true;
  }
}
