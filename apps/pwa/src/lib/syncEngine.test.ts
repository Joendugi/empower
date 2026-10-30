import { afterEach, describe, expect, it, vi } from 'vitest';
import type { QueuedEvent } from '@/lib/idbQueue';

const queue = new Map<string, QueuedEvent>();

vi.mock('@/lib/idbQueue', () => ({
  listQueue: async () => [...queue.values()].sort((a, b) => a.queuedAt.localeCompare(b.queuedAt)),
  removeFromQueue: async (id: string) => {
    queue.delete(id);
  },
}));

const { runCloudSync } = await import('@/lib/syncEngine');
const { useLearnerStore } = await import('@/store/learnerStore');
const { CLOUD_COOKIE_TOKEN } = await import('@/lib/tokenVault');

function queued(id: string, type: QueuedEvent['type'], payload: Record<string, unknown>): QueuedEvent {
  return { id, type, path: type === 'submission' ? '/submissions' : '/lessons/l1/complete', payload, queuedAt: id };
}

describe('offline queue sync', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    queue.clear();
    useLearnerStore.getState().lockSession();
  });

  it('sends the whole queue in one /sync call and applies the server state', async () => {
    useLearnerStore.getState().applyAuth(CLOUD_COOKIE_TOKEN, {
      id: 'l1',
      email: 'amina@poly.ac.ke',
      displayName: 'Amina',
      preferredLanguage: 'en',
      totalXp: 0,
      level: 1,
      isGuest: false,
    });
    for (const event of [
      queued('2026-01-01-a', 'submission', { lessonId: 'l1', exerciseId: 'q1', answer: 'a' }),
      queued('2026-01-01-b', 'submission', { lessonId: 'l1', exerciseId: 'gone', answer: 'a' }),
      queued('2026-01-01-c', 'lesson_complete', { lessonId: 'l1' }),
    ]) {
      queue.set(event.id, event);
    }

    const posted: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init?: RequestInit) => {
        const path = url.replace(/^.*\/api\/v1/, '');
        if (path !== '/sync') return new Response('{}', { status: 404 });
        const body = JSON.parse(String(init?.body)) as { events: Array<{ id: string }> };
        posted.push(...body.events.map((event) => event.id));
        return new Response(
          JSON.stringify({
            results: [
              { id: '2026-01-01-a', status: 'applied' },
              { id: '2026-01-01-b', status: 'rejected', detail: 'Exercise not found' },
              { id: '2026-01-01-c', status: 'duplicate' },
            ],
            state: {
              totalXp: 140,
              level: 2,
              completedLessonIds: ['l1'],
              currentStreak: 3,
              longestStreak: 5,
              freezeTokens: 1,
            },
          }),
          { status: 200 }
        );
      })
    );

    await runCloudSync();

    expect(posted).toEqual(['2026-01-01-a', '2026-01-01-b', '2026-01-01-c']);
    expect(queue.size).toBe(0); // the rejected event doesn't block the queue
    const state = useLearnerStore.getState();
    expect(state.xp).toBe(140);
    expect(state.streak).toBe(3);
    expect(state.completedLessonIds).toContain('l1');
  });
});
