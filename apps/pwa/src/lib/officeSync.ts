import type { Lesson, SkillPath } from '@cyberlearn/types';
import { api } from '@/lib/api';
import { isLocalToken } from '@/lib/localApi';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useCurriculumStore } from '@/store/curriculumStore';
import { useLearnerStore } from '@/store/learnerStore';
import { useModerationStore } from '@/store/moderationStore';

interface StudioSnapshot {
  drafts: unknown[];
  published: Array<{ path: SkillPath; lessons: Lesson[]; contentVersion?: string }>;
}

interface ModerationSnapshot {
  applications: unknown[];
  proposals: unknown[];
}

export async function syncOfficeCloud() {
  const token = useLearnerStore.getState().token;
  if (!token || isLocalToken(token)) return;

  const curriculum = useCurriculumStore.getState();
  const published = curriculum.paths.map((path) => ({
    path,
    lessons: path.nodes.flatMap((node) => node.lessonIds.map((id) => curriculum.lessons[id]).filter(Boolean)),
    contentVersion: new Date().toISOString(),
  }));
  const studio = await api<StudioSnapshot>('/studio/sync', {
    method: 'PUT',
    body: JSON.stringify({ drafts: curriculum.drafts, published }),
  });
  if (studio.drafts?.length) {
    for (const draft of studio.drafts as Array<{ id: string }>) {
      curriculum.saveDraft(draft as never);
    }
  }

  const moderation = useModerationStore.getState();
  const remoteModeration = await api<ModerationSnapshot>('/moderation/sync', {
    method: 'PUT',
    body: JSON.stringify({
      applications: moderation.applications,
      proposals: moderation.proposals,
    }),
  });
  useModerationStore.setState({
    applications: remoteModeration.applications as typeof moderation.applications,
    proposals: remoteModeration.proposals as typeof moderation.proposals,
  });

  const events = useAnalyticsStore.getState().events.slice(-200);
  if (events.length) {
    await api('/analytics/events', {
      method: 'POST',
      body: JSON.stringify({
        events: events.map((event) => ({
          id: event.id,
          type: event.type,
          pathId: event.pathId,
          lessonId: event.lessonId,
          at: event.at,
        })),
      }),
    });
  }
}
