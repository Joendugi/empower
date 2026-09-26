import { useState } from 'react';
import { Plus, Trash2, ClipboardCheck } from 'lucide-react';
import { useLearnerStore } from '@/store/learnerStore';

interface Criterion {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = useLearnerStore.getState().token;
  const res = await fetch(`http://127.0.0.1:8000${url}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json() as Promise<T>;
}

const field =
  'w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/60';

export default function RubricBuilder({
  lessonId,
  onCreated,
}: {
  lessonId: string;
  onCreated?: (id: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: crypto.randomUUID(), label: '', description: '', required: true },
  ]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCriterion = () =>
    setCriteria((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: '', description: '', required: true },
    ]);

  const updateCriterion = (id: string, patch: Partial<Criterion>) =>
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const removeCriterion = (id: string) =>
    setCriteria((prev) => prev.filter((c) => c.id !== id));

  const save = async () => {
    if (!title.trim() || criteria.some((c) => !c.label.trim())) {
      setError('Please fill in the rubric title and all criterion labels.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const result = await apiFetch<{ id: string }>('/api/v1/rubrics', {
        method: 'POST',
        body: JSON.stringify({ lessonId, title: title.trim(), criteria }),
      });
      setSaved(true);
      onCreated?.(result.id);
    } catch {
      setError('Failed to save rubric — check your connection.');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="card border-accent/40 text-center py-8 space-y-2">
        <ClipboardCheck className="w-8 h-8 text-accent mx-auto" />
        <p className="text-sm font-semibold text-accent">Rubric saved!</p>
        <p className="text-xs text-muted">Learners can now submit evidence for sign-off.</p>
        <button
          className="btn-secondary text-xs mt-2"
          onClick={() => {
            setSaved(false);
            setTitle('');
            setCriteria([{ id: crypto.randomUUID(), label: '', description: '', required: true }]);
          }}
        >
          Create another
        </button>
      </div>
    );
  }

  return (
    <div className="card border-white/[0.08] space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
        <ClipboardCheck className="w-4 h-4" />
        <h3>Practical Sign-Off Rubric</h3>
      </div>

      {error && (
        <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <input
        className={field}
        placeholder="Rubric title (e.g. Solar Panel Installation — Week 3)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="space-y-3">
        {criteria.map((c, i) => (
          <div
            key={c.id}
            className="p-3 rounded-xl bg-surface-light/40 border border-white/[0.06] space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted font-mono w-5">{i + 1}.</span>
              <input
                className={`flex-1 ${field}`}
                placeholder="Criterion label (e.g. Correctly wired inverter)"
                value={c.label}
                onChange={(e) => updateCriterion(c.id, { label: e.target.value })}
              />
              <button
                onClick={() => removeCriterion(c.id)}
                className="p-1.5 text-muted hover:text-danger transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              className={field}
              placeholder="Description / what to observe"
              value={c.description}
              onChange={(e) => updateCriterion(c.id, { description: e.target.value })}
            />
            <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={c.required}
                onChange={(e) => updateCriterion(c.id, { required: e.target.checked })}
                className="accent-accent"
              />
              Required for pass
            </label>
          </div>
        ))}
      </div>

      <button onClick={addCriterion} className="btn-secondary text-xs flex items-center gap-1">
        <Plus className="w-3.5 h-3.5" /> Add criterion
      </button>

      <button onClick={() => void save()} disabled={saving} className="btn-primary w-full disabled:opacity-50">
        {saving ? 'Saving…' : 'Save rubric'}
      </button>
    </div>
  );
}
