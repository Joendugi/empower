import { useEffect, useState, useMemo } from 'react';
import { getStaffKey } from '@/lib/adminAccess';
import { fetchDraftManifest, approveDraft, rejectDraft, type DraftSummary } from '@/lib/draftApi';

export default function DraftReviewPanel() {
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  // Held in memory only; the API rejects draft actions without the office staff key.
  const [staffKey, setStaffKey] = useState(() => getStaffKey() ?? '');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const reloadDrafts = () => {
    fetchDraftManifest().then((data) => {
      setDrafts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    reloadDrafts();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await approveDraft(id, staffKey);
      setNotification({ type: 'success', message: res.message });
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setNotification({ type: 'error', message: err instanceof Error ? err.message : 'Failed to approve draft' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await rejectDraft(id, staffKey);
      setNotification({ type: 'success', message: res.message });
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setNotification({ type: 'error', message: err instanceof Error ? err.message : 'Failed to reject draft' });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredDrafts = useMemo(() => {
    if (filterTrack === 'all') return drafts;
    return drafts.filter((d) => d.track === filterTrack);
  }, [drafts, filterTrack]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            AI Lesson Drafts
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/20 text-accent font-mono font-medium">
              {drafts.length} Staged
            </span>
          </h2>
          <p className="text-xs text-muted mt-1">
            Generated curriculum topics pending educator review and pedagogical verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label className="text-muted" htmlFor="draft-staff-key">Staff key:</label>
          <input
            id="draft-staff-key"
            type="password"
            autoComplete="off"
            className="rounded-lg bg-primary-dark border border-surface-light px-2.5 py-1.5 text-white w-36"
            value={staffKey}
            onChange={(e) => setStaffKey(e.target.value)}
          />
          <label className="text-muted">Track filter:</label>
          <select
            className="rounded-lg bg-primary-dark border border-surface-light px-2.5 py-1.5 text-white"
            value={filterTrack}
            onChange={(e) => setFilterTrack(e.target.value)}
          >
            <option value="all">All Tracks</option>
            <option value="trades">Trades</option>
            <option value="tvet">TVET</option>
            <option value="cybersecurity">Cybersecurity</option>
          </select>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-200'
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-xs opacity-70 hover:opacity-100 px-2 py-0.5 rounded border border-white/20"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="card text-center py-12 text-muted text-sm">
          Loading drafts manifest...
        </div>
      ) : filteredDrafts.length === 0 ? (
        <div className="card text-center py-12 text-muted text-sm">
          No drafts found. Run <code className="text-accent font-mono">python scripts/ai_lesson_researcher.py</code> to generate lessons.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDrafts.map((draft) => {
            const trackColor =
              draft.track === 'cybersecurity'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : draft.track === 'tvet'
                ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

            return (
              <div key={draft.id} className="card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${trackColor}`}>
                        {draft.track}
                      </span>
                      {draft.course && (
                        <span className="text-[10px] text-muted font-mono bg-surface-dark px-2 py-0.5 rounded border border-surface-light">
                          {draft.course}
                        </span>
                      )}
                      {draft.cdacc && (
                        <span className="text-[10px] text-muted-light font-mono">
                          {draft.cdacc}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-base text-white">{draft.title}</h3>
                    {draft.titleSw && (
                      <p className="text-xs text-muted italic mt-0.5">{draft.titleSw}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-accent font-mono">
                        {draft.quality.overall}%
                      </div>
                      <div className="text-[10px] text-muted uppercase tracking-wider">Quality</div>
                    </div>
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-surface-light text-xs">
                  <div>
                    <div className="flex justify-between text-[10px] text-muted mb-1">
                      <span>Interactiveness</span>
                      <span className="font-mono text-emerald-400">{draft.quality.interactiveness}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-light overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${draft.quality.interactiveness}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-muted mb-1">
                      <span>Detail & Rigor</span>
                      <span className="font-mono text-sky-400">{draft.quality.detailAndSafety}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-light overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${draft.quality.detailAndSafety}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-muted mb-1">
                      <span>Readability</span>
                      <span className="font-mono text-amber-400">{draft.quality.easeOfUnderstanding}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-light overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${draft.quality.easeOfUnderstanding}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-muted mb-1">
                      <span>Multimedia</span>
                      <span className="font-mono text-indigo-400">{draft.quality.multimedia}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-light overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${draft.quality.multimedia}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-surface-light/60">
                  <span className="text-[11px] text-muted font-mono truncate max-w-[240px]">
                    {draft.id}.yaml
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={processingId === draft.id || !staffKey}
                      onClick={() => handleReject(draft.id)}
                      className="px-3 py-1 rounded-lg text-xs bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors disabled:opacity-50"
                    >
                      {processingId === draft.id ? 'Processing...' : 'Reject / Archive'}
                    </button>
                    <button
                      type="button"
                      disabled={processingId === draft.id || !staffKey}
                      onClick={() => handleApprove(draft.id)}
                      className="px-3 py-1 rounded-lg text-xs bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 font-medium transition-colors disabled:opacity-50"
                    >
                      {processingId === draft.id ? 'Publishing...' : 'Approve & Publish'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
