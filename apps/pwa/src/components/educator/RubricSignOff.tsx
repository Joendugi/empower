import { useEffect, useState } from 'react';
import { CheckSquare, Square, Loader2 } from 'lucide-react';
import { useLearnerStore } from '@/store/learnerStore';

interface Criterion {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

interface Rubric {
  id: string;
  lessonId: string;
  educatorId: string;
  title: string;
  criteria: Criterion[];
  createdAt: string;
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

export default function RubricSignOff({
  rubricId,
  studentId,
  studentName,
}: {
  rubricId: string;
  studentId: string;
  studentName: string;
}) {
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [evidence, setEvidence] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ passed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Rubric[]>('/api/v1/rubrics')
      .then((items) => {
        const found = items.find((r) => r.id === rubricId) ?? null;
        setRubric(found);
      })
      .catch(() => setError('Failed to load rubric'))
      .finally(() => setLoading(false));
  }, [rubricId]);

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const submit = async () => {
    if (!rubric) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiFetch<{ passed: boolean }>(
        `/api/v1/rubrics/${rubricId}/signoff`,
        {
          method: 'POST',
          body: JSON.stringify({
            learnerId: studentId,
            evidenceNote: evidence,
            criteriaMet: Array.from(checked),
          }),
        },
      );
      setResult(res);
    } catch {
      setError('Failed to submit sign-off');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading rubric…
      </div>
    );
  }
  if (!rubric) return <p className="text-sm text-danger">Rubric not found.</p>;

  if (result) {
    return (
      <div
        className={`card text-center py-6 space-y-2 ${
          result.passed ? 'border-success/40' : 'border-danger/40'
        }`}
      >
        <p className={`text-lg font-bold ${result.passed ? 'text-success' : 'text-danger'}`}>
          {result.passed ? '✅ PASSED' : '❌ Not yet passed'}
        </p>
        <p className="text-sm text-muted">
          Sign-off recorded for <strong>{studentName}</strong>
        </p>
      </div>
    );
  }

  const requiredCount = rubric.criteria.filter((c) => c.required).length;
  const metRequired = rubric.criteria.filter((c) => c.required && checked.has(c.id)).length;

  return (
    <div className="card border-white/[0.08] space-y-4">
      <h3 className="font-semibold text-white">{rubric.title}</h3>
      <p className="text-xs text-muted">
        Signing off for: <strong className="text-white">{studentName}</strong>
      </p>

      {error && <p className="text-xs text-danger">{error}</p>}

      <div className="space-y-2">
        {rubric.criteria.map((c) => (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-colors ${
              checked.has(c.id)
                ? 'bg-accent/10 border-accent/40'
                : 'bg-surface-light/30 border-white/[0.06]'
            }`}
          >
            {checked.has(c.id) ? (
              <CheckSquare className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-muted mt-0.5 shrink-0" />
            )}
            <div>
              <p className="text-sm font-medium text-white">{c.label}</p>
              {c.description && <p className="text-xs text-muted mt-0.5">{c.description}</p>}
              {c.required && <span className="text-[10px] text-amber-400">Required</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="text-xs text-muted">
        {metRequired}/{requiredCount} required criteria met
      </div>

      <textarea
        className="w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-2.5 text-sm text-white placeholder:text-muted min-h-[72px] focus:outline-none focus:border-accent/60"
        placeholder="Evidence notes (what you observed, any comments)…"
        value={evidence}
        onChange={(e) => setEvidence(e.target.value)}
      />

      <button
        onClick={() => void submit()}
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-50"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Submit Sign-Off
      </button>
    </div>
  );
}
