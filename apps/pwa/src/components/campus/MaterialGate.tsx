import { FormEvent, useState, type ReactNode } from 'react';
import { isMaterialLocked, isMaterialUnlocked, unlockMaterial } from '@/store/campusCatalogue';

export default function MaterialGate({
  pathId,
  title,
  children,
}: {
  pathId: string;
  title: string;
  children: ReactNode;
}) {
  const locked = isMaterialLocked(pathId);
  const [open, setOpen] = useState(() => isMaterialUnlocked(pathId));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!locked || open) return <>{children}</>;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await unlockMaterial(pathId, password);
    if (!ok) {
      setError('That password does not open this material.');
      return;
    }
    setOpen(true);
  };

  return (
    <form className="card space-y-3" onSubmit={(event) => void submit(event)}>
      <p className="text-xs uppercase tracking-wider text-accent font-semibold">Institutional material</p>
      <h2 className="text-xl font-semibold">{title} is locked</h2>
      <p className="text-sm text-muted">
        The trainer set a password for this campus copy. Leave the field empty only if they told you it is free.
      </p>
      <input
        className="w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-3"
        type="password"
        placeholder="Material password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <button className="btn-primary" type="submit">
        Unlock
      </button>
    </form>
  );
}
