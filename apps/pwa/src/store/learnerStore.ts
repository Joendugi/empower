import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthLearner, Badge, ProgrammeTrack } from '@cyberlearn/types';
import { isLocalUserToken, resumeLocalSession, updateLocalProfile } from '@/lib/localAccounts';
import {
  getDeviceId,
  isSessionFresh,
  LOCAL_SESSION_MS,
  newSessionId,
  sessionExpiryForToken,
  type AuthSource,
} from '@/lib/sessionSecurity';
import { CLOUD_COOKIE_TOKEN, clearSessionToken, readSessionToken, writeSessionToken } from '@/lib/tokenVault';
import { clearAdminGrant } from '@/lib/adminAccess';
import { canAddActivePath, trimActivePathIds } from '@/lib/activeCourses';
import { usePlatformStore } from '@/store/platformStore';

export type LearnerRole = 'student' | 'artisan' | 'jobseeker' | 'community' | 'trainer';
export type LearnerGoal = 'certificate' | 'work' | 'enterprise' | 'community' | 'exam';
export { MAX_ACTIVE_COURSES, trimActivePathIds } from '@/lib/activeCourses';

interface LearnerState {
  token: string | null;
  learnerId: string | null;
  displayName: string | null;
  email: string | null;
  isGuest: boolean;
  language: 'en' | 'sw';
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  freezeTokens: number;
  badges: Badge[];
  completedLessonIds: string[];
  sessionId: string | null;
  sessionIssuedAt: number | null;
  sessionExpiresAt: number | null;
  lastActiveAt: number | null;
  authSource: AuthSource | null;
  deviceId: string | null;
  chosenPathIds: string[];
  onboardingCompleted: boolean;
  learnerRole: LearnerRole | null;
  learnerGoal: LearnerGoal | null;
  preferredTrack: ProgrammeTrack | 'all' | null;

  applyAuth: (token: string, learner: AuthLearner) => void;
  applyXp: (totalXp: number, level: number) => void;
  setStreak: (current: number, longest: number, freezeTokens?: number) => void;
  addBadge: (badge: Badge) => void;
  markLessonComplete: (lessonId: string) => void;
  setLanguage: (language: 'en' | 'sw') => void;
  setDisplayName: (displayName: string) => void;
  canChoosePath: (pathId: string) => boolean;
  choosePath: (pathId: string) => boolean;
  leavePath: (pathId: string) => void;
  completeOnboarding: (input: {
    role: LearnerRole;
    goal: LearnerGoal;
    track: ProgrammeTrack | 'all';
    pathId?: string;
  }) => void;
  restartOnboarding: () => void;
  touchSession: () => void;
  isSessionValid: () => boolean;
  lockSession: () => void;
  downgradeToLocal: () => boolean;
  reset: () => void;
}

function mirrorLibrarySelect(pathId: string) {
  void import('@/store/libraryStore').then(({ useLibraryStore }) => {
    useLibraryStore.getState().selectProgramme(pathId);
  });
}

function mirrorLibraryDeselect(pathId: string) {
  void import('@/store/libraryStore').then(({ useLibraryStore }) => {
    useLibraryStore.getState().deselectProgramme(pathId);
  });
}

export function xpToLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

const empty = {
  token: null,
  learnerId: null,
  displayName: null,
  email: null,
  isGuest: false,
  language: 'en' as const,
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  freezeTokens: 2,
  badges: [] as Badge[],
  completedLessonIds: [] as string[],
  sessionId: null,
  sessionIssuedAt: null,
  sessionExpiresAt: null,
  lastActiveAt: null,
  authSource: null as AuthSource | null,
  deviceId: null,
  chosenPathIds: [] as string[],
  onboardingCompleted: false,
  learnerRole: null as LearnerRole | null,
  learnerGoal: null as LearnerGoal | null,
  preferredTrack: null as ProgrammeTrack | 'all' | null,
};

function sessionFields(token: string) {
  const now = Date.now();
  return {
    sessionId: newSessionId(),
    sessionIssuedAt: now,
    sessionExpiresAt: sessionExpiryForToken(token, now),
    lastActiveAt: now,
    authSource: (token === 'local-offline' || isLocalUserToken(token) ? 'local' : 'cloud') as AuthSource,
    deviceId: getDeviceId(),
  };
}

export const useLearnerStore = create<LearnerState>()(
  persist(
    (set, get) => ({
      ...empty,

      applyAuth: (token, learner) => {
        const cloudJwt =
          token !== 'local-offline' &&
          token !== CLOUD_COOKIE_TOKEN &&
          !isLocalUserToken(token);
        const session = sessionFields(token);
        const stored = cloudJwt ? CLOUD_COOKIE_TOKEN : token;
        writeSessionToken(stored);
        set((state) => ({
          token: stored,
          learnerId: learner.id,
          displayName: learner.displayName,
          email: learner.email,
          isGuest: learner.isGuest,
          language: learner.preferredLanguage,
          xp: Math.max(state.xp, learner.totalXp),
          level: Math.max(state.level, learner.level),
          ...session,
        }));
      },

      applyXp: (totalXp, level) => set({ xp: totalXp, level }),

      setStreak: (current, longest, freezeTokens) =>
        set((state) => ({
          streak: current,
          longestStreak: Math.max(longest, current),
          freezeTokens: freezeTokens ?? state.freezeTokens,
        })),

      addBadge: (badge) =>
        set((state) => ({
          badges: state.badges.some((item) => item.id === badge.id)
            ? state.badges
            : [...state.badges, badge],
        })),

      markLessonComplete: (lessonId) => {
        import('@/store/analyticsStore').then(({ useAnalyticsStore }) => {
          useAnalyticsStore.getState().record('lesson_complete', { lessonId });
        }).catch(() => undefined);
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(lessonId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, lessonId],
        }));
      },

      setLanguage: (language) => {
        const email = get().email;
        if (email) updateLocalProfile(email, { preferredLanguage: language });
        set({ language });
      },

      setDisplayName: (displayName) => {
        const next = displayName.trim();
        if (!next) return;
        const email = get().email;
        if (email) updateLocalProfile(email, { displayName: next });
        set({ displayName: next });
      },

      canChoosePath: (pathId) => canAddActivePath(get().chosenPathIds, pathId),

      choosePath: (pathId) => {
        const state = get();
        if (state.chosenPathIds.includes(pathId)) {
          mirrorLibrarySelect(pathId);
          return true;
        }
        if (!canAddActivePath(state.chosenPathIds, pathId)) {
          return false;
        }
        import('@/store/analyticsStore')
          .then(({ useAnalyticsStore }) => {
            useAnalyticsStore.getState().record('course_choose', { pathId });
          })
          .catch(() => undefined);
        set({ chosenPathIds: [...state.chosenPathIds, pathId] });
        mirrorLibrarySelect(pathId);
        return true;
      },

      leavePath: (pathId) => {
        set((state) => ({
          chosenPathIds: state.chosenPathIds.filter((id) => id !== pathId),
        }));
        mirrorLibraryDeselect(pathId);
      },

      completeOnboarding: ({ role, goal, track, pathId }) => {
        set({
          learnerRole: role,
          learnerGoal: goal,
          preferredTrack: track,
          onboardingCompleted: true,
        });
        if (pathId) get().choosePath(pathId);
      },

      restartOnboarding: () => set({ onboardingCompleted: false }),

      touchSession: () => {
        const state = get();
        if (!state.token) return;
        const now = Date.now();
        set({
          lastActiveAt: now,
          sessionExpiresAt:
            state.authSource === 'cloud'
              ? state.sessionExpiresAt
              : now + LOCAL_SESSION_MS,
        });
      },

      isSessionValid: () => {
        const state = get();
        if (!state.token || state.isGuest) return false;
        return isSessionFresh({
          expiresAt: state.sessionExpiresAt,
          lastActiveAt: state.lastActiveAt,
          deviceId: state.deviceId,
        });
      },

      lockSession: () => {
        clearSessionToken();
        clearAdminGrant();
        set((state) => ({
          token: null,
          sessionId: null,
          sessionIssuedAt: null,
          sessionExpiresAt: null,
          lastActiveAt: null,
          authSource: null,
          deviceId: state.deviceId,
          isGuest: false,
        }));
      },

      downgradeToLocal: () => {
        const state = get();
        if (!state.email) {
          get().lockSession();
          return false;
        }
        const local = resumeLocalSession(state.email);
        if (!local) {
          get().lockSession();
          return false;
        }
        get().applyAuth(local.accessToken, {
          ...local.learner,
          totalXp: state.xp,
          level: state.level,
        });
        return true;
      },

      reset: () => {
        clearSessionToken();
        clearAdminGrant();
        if (typeof fetch !== 'undefined') {
          const apiBase = usePlatformStore.getState().apiBaseUrl.replace(/\/$/, '') || '/api/v1';
          void fetch(`${apiBase}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          }).catch(() => undefined);
        }
        set((state) => ({ ...empty, language: state.language, deviceId: getDeviceId() }));
      },
    }),
    {
      name: 'cyberlearn-learner',
      version: 5,
      partialize: (state) => ({
        learnerId: state.learnerId,
        displayName: state.displayName,
        email: state.email,
        isGuest: state.isGuest,
        language: state.language,
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        longestStreak: state.longestStreak,
        freezeTokens: state.freezeTokens,
        badges: state.badges,
        completedLessonIds: state.completedLessonIds,
        sessionId: state.sessionId,
        sessionIssuedAt: state.sessionIssuedAt,
        sessionExpiresAt: state.sessionExpiresAt,
        lastActiveAt: state.lastActiveAt,
        authSource: state.authSource,
        deviceId: state.deviceId,
        chosenPathIds: state.chosenPathIds,
        onboardingCompleted: state.onboardingCompleted,
        learnerRole: state.learnerRole,
        learnerGoal: state.learnerGoal,
        preferredTrack: state.preferredTrack,
      }),
      migrate: (persisted, version) => {
        const state = { ...empty, ...((persisted ?? {}) as Partial<LearnerState>) };
        if (version < 2 && state.token) {
          const now = Date.now();
          state.sessionId = state.sessionId ?? newSessionId();
          state.sessionIssuedAt = state.sessionIssuedAt ?? now;
          state.sessionExpiresAt = state.sessionExpiresAt ?? sessionExpiryForToken(state.token, now);
          state.lastActiveAt = state.lastActiveAt ?? now;
          state.authSource =
            state.authSource ??
            (state.token === 'local-offline' || isLocalUserToken(state.token) ? 'local' : 'cloud');
          state.deviceId = state.deviceId ?? getDeviceId();
        }
        if (version < 3) {
          state.onboardingCompleted = Boolean(
            state.completedLessonIds?.length || state.chosenPathIds?.length
          );
        }
        if (version < 4) {
          state.token = null;
        }
        if (version < 5) {
          state.chosenPathIds = trimActivePathIds(state.chosenPathIds ?? []);
        }
        return state;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.token = readSessionToken();
        state.chosenPathIds = trimActivePathIds(state.chosenPathIds ?? []);
      },
    }
  )
);
