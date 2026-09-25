import type { LeaderboardEntry, Lesson, TokenResponse } from '@cyberlearn/types';
import { getLesson, getSkillPaths } from '@/content';
import {
  LocalAuthError,
  isLocalUserToken,
  loginLocal,
  parseAuthBody,
  registerLocal,
} from '@/lib/localAccounts';
import { useLearnerStore } from '@/store/learnerStore';

export const OFFLINE_TOKEN = 'local-offline';

export function isLocalToken(token: string | null | undefined): boolean {
  return token === OFFLINE_TOKEN || isLocalUserToken(token);
}

export function localProgress() {
  const completedLessonIds = useLearnerStore.getState().completedLessonIds;
  const nodeCompletion: Record<string, number> = {};
  for (const path of getSkillPaths()) {
    for (const node of path.nodes) {
      if (!node.lessonIds.length) continue;
      const done = node.lessonIds.filter((id) => completedLessonIds.includes(id)).length;
      nodeCompletion[node.id] = Math.round((done / node.lessonIds.length) * 100);
    }
  }
  return { completedLessonIds, nodeCompletion };
}

export function localLeaderboard(): LeaderboardEntry[] {
  const state = useLearnerStore.getState();
  return [
    {
      rank: 1,
      learnerId: state.learnerId ?? 'local-guest',
      displayName: state.displayName ?? 'You',
      totalXp: state.xp,
      level: state.level,
    },
  ];
}

export function localGuestSession(): TokenResponse {
  const state = useLearnerStore.getState();
  return {
    accessToken: OFFLINE_TOKEN,
    tokenType: 'bearer',
    learner: {
      id: state.learnerId ?? 'local-guest',
      email: state.email,
      displayName: state.displayName ?? 'Learner',
      preferredLanguage: state.language,
      totalXp: state.xp,
      level: state.level,
      isGuest: true,
    },
  };
}

export async function resolveLocalApi<T>(
  path: string,
  method = 'GET',
  body?: BodyInit | null
): Promise<T | undefined> {
  const verb = method.toUpperCase();
  const [clean] = path.split('?');

  if (verb === 'GET' && clean === '/skill-paths') {
    return getSkillPaths() as T;
  }
  if (verb === 'GET' && clean === '/progress/me') {
    return localProgress() as T;
  }
  if (verb === 'GET' && clean === '/leaderboard') {
    return localLeaderboard() as T;
  }
  if (verb === 'GET' && clean === '/auth/me') {
    const state = useLearnerStore.getState();
    if (!state.token || !isLocalToken(state.token)) return undefined;
    return {
      id: state.learnerId ?? 'local-guest',
      email: state.email,
      displayName: state.displayName ?? 'Learner',
      preferredLanguage: state.language,
      totalXp: state.xp,
      level: state.level,
      isGuest: state.isGuest,
    } as T;
  }
  if (verb === 'GET' && clean.startsWith('/lessons/')) {
    const id = clean.replace('/lessons/', '').replace(/\/complete$/, '');
    if (clean.endsWith('/complete')) return undefined;
    const lesson = getLesson(id);
    return lesson as T | undefined;
  }
  if (verb === 'POST' && clean === '/auth/guest') {
    return localGuestSession() as T;
  }
  if (verb === 'POST' && (clean === '/auth/login' || clean === '/auth/register')) {
    const payload = parseAuthBody(body);
    if (!payload) return undefined;
    try {
      const session =
        clean === '/auth/register'
          ? await registerLocal(payload)
          : await loginLocal(payload.email, payload.password);
      return session as T;
    } catch (error) {
      if (error instanceof LocalAuthError && error.status === 401) {
        return undefined;
      }
      throw error;
    }
  }
  return undefined;
}

export function isPackagedLesson(lesson: Lesson | undefined): lesson is Lesson {
  return Boolean(lesson);
}
