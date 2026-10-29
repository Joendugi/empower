import { api } from '@/lib/api';

export interface DraftSummary {
  id: string;
  title: string;
  titleSw: string;
  course: string;
  track: 'trades' | 'cybersecurity' | 'tvet';
  cdacc: string;
  status: string;
  createdAt: string;
  quality: {
    interactiveness: number;
    detailAndSafety: number;
    easeOfUnderstanding: number;
    multimedia: number;
    overall: number;
  };
}

export async function fetchDraftManifest(): Promise<DraftSummary[]> {
  try {
    const res = await fetch('/drafts-manifest.json?t=' + Date.now());
    if (!res.ok) return [];
    return (await res.json()) as DraftSummary[];
  } catch {
    return [];
  }
}

type DraftActionResult = { ok: boolean; message: string; lessonId?: string; draftId?: string };

function draftAction(draftId: string, action: 'approve' | 'reject', staffKey: string) {
  return api<DraftActionResult>(`/studio/drafts/${encodeURIComponent(draftId)}/${action}`, {
    method: 'POST',
    headers: { 'X-Staff-Key': staffKey },
  });
}

export function approveDraft(draftId: string, staffKey: string) {
  return draftAction(draftId, 'approve', staffKey);
}

export function rejectDraft(draftId: string, staffKey: string) {
  return draftAction(draftId, 'reject', staffKey);
}
