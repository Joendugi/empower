import { describe, it, expect, beforeEach } from 'vitest';
import { VirtualFileSystem } from './vfs';
import { ShellSession } from './shell';

describe('In-Browser Linux Virtual File System (VFS)', () => {
  let vfs: VirtualFileSystem;

  beforeEach(() => {
    vfs = new VirtualFileSystem();
  });

  it('initializes standard directories and welcome files', () => {
    expect(vfs.exists('/bin')).toBe(true);
    expect(vfs.exists('/etc')).toBe(true);
    expect(vfs.exists('/home/learner')).toBe(true);
    expect(vfs.exists('/var/log/auth.log')).toBe(true);

    const welcome = vfs.readFile('/home/learner/welcome.txt');
    expect(welcome).toContain('Welcome to CyberLearn Sandbox');
  });

  it('resolves relative and tilde paths accurately', () => {
    expect(vfs.resolve('/home/learner', 'test.txt')).toBe('/home/learner/test.txt');
    expect(vfs.resolve('/home/learner', '../learner/test.txt')).toBe('/home/learner/test.txt');
    expect(vfs.resolve('/home/learner', '~/notes.txt')).toBe('/home/learner/notes.txt');
    expect(vfs.resolve('/var/log', '/etc/hostname')).toBe('/etc/hostname');
  });

  it('writes, reads, appends, and deletes files', () => {
    expect(vfs.writeFile('/tmp/demo.txt', 'Line 1\n')).toBe(true);
    expect(vfs.readFile('/tmp/demo.txt')).toBe('Line 1\n');

    expect(vfs.appendFile('/tmp/demo.txt', 'Line 2\n')).toBe(true);
    expect(vfs.readFile('/tmp/demo.txt')).toBe('Line 1\nLine 2\n');

    expect(vfs.unlink('/tmp/demo.txt')).toBe(true);
    expect(vfs.exists('/tmp/demo.txt')).toBe(false);
  });

  it('changes permissions and formats permission strings', () => {
    vfs.writeFile('/home/learner/test.sh', '#!/bin/bash\n', 0o644);
    vfs.chmod('/home/learner/test.sh', 0o755);

    const list = vfs.listDir('/home/learner');
    const entry = list?.find((e) => e.name === 'test.sh');
    expect(entry?.permissionsString).toBe('-rwxr-xr-x');
  });
});

describe('In-Browser Linux Shell Execution Engine', () => {
  let shell: ShellSession;

  beforeEach(() => {
    shell = new ShellSession();
  });

  it('executes basic navigation commands (pwd, cd, whoami)', async () => {
    let res = await shell.execute('pwd');
    expect(res.stdout).toBe('/home/learner');

    res = await shell.execute('whoami');
    expect(res.stdout).toBe('learner');

    res = await shell.execute('cd /etc');
    expect(res.exitCode).toBe(0);

    res = await shell.execute('pwd');
    expect(res.stdout).toBe('/etc');

    res = await shell.execute('cd ..');
    expect(shell.cwd).toBe('/');
  });

  it('runs echo and file redirection (> and >>)', async () => {
    await shell.execute('echo "Cyber defense in depth" > /home/learner/motto.txt');
    const content = shell.vfs.readFile('/home/learner/motto.txt');
    expect(content).toBe('Cyber defense in depth');

    await shell.execute('echo "Second line" >> /home/learner/motto.txt');
    expect(shell.vfs.readFile('/home/learner/motto.txt')).toBe('Cyber defense in depthSecond line');
  });

  it('executes pipes and grep filtering on realistic log data', async () => {
    const res = await shell.execute('cat /var/log/auth.log | grep Failed');
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain('Failed password for invalid user admin');
    expect(res.stdout).toContain('Failed password for invalid user root');
  });

  it('calculates sha256 hashes using browser WebCrypto', async () => {
    shell.vfs.writeFile('/tmp/hashme.txt', 'Rebuild2031');
    const res = await shell.execute('sha256sum /tmp/hashme.txt');
    expect(res.exitCode).toBe(0);
    // SHA256 of "Rebuild2031"
    expect(res.stdout).toContain('00fe72679a814d91d1e16758128dadec04bed1c477b316a2d54dbb5b6897e0d2');
  });

  it('encodes and decodes base64 strings', async () => {
    const res = await shell.execute('echo "Kikosi" | base64');
    expect(res.exitCode).toBe(0);
    const b64 = res.stdout.trim();

    const decoded = await shell.execute(`echo "${b64}" | base64 -d`);
    expect(decoded.stdout.trim()).toBe('Kikosi');
  });

  it('runs python commands and scripts', async () => {
    const res = await shell.execute('python3 -c "print(40 + 2)"');
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toBe('42');
  });
});
