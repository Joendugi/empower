import type { AuthLearner, SubmissionResult, TokenResponse } from '@cyberlearn/types';
import { api } from '@/lib/api';
import { enqueue } from '@/lib/idbQueue';
import { isAnswerCorrect } from '@/lib/hash';
import { cloudRecentlyDown } from '@/lib/cloudCircuit';
import { isLocalToken, localGuestSession } from '@/lib/localApi';
import { CLOUD_COOKIE_TOKEN } from '@/lib/tokenVault';
import { scheduleCloudSync } from '@/lib/syncEngine';
import { useLearnerStore, xpToLevel } from '@/store/learnerStore';
import type { Exercise } from '@cyberlearn/types';

export async function ensureSession(): Promise<void> {
  const state = useLearnerStore.getState();
  if (state.token) return;
  try {
    const created = await api<TokenResponse>('/auth/guest', {
      method: 'POST',
      body: JSON.stringify({
        displayName: state.displayName ?? 'Learner',
        preferredLanguage: state.language,
      }),
    });
    state.applyAuth(created.accessToken || CLOUD_COOKIE_TOKEN, created.learner);
  } catch {
    const fallback = localGuestSession();
    state.applyAuth(fallback.accessToken, fallback.learner);
  }
}

export async function gradeExercise(
  lessonId: string,
  exercise: Exercise,
  answer: string | string[]
): Promise<SubmissionResult> {
  const store = useLearnerStore.getState();
  const canCloud = store.token && !isLocalToken(store.token) && !cloudRecentlyDown();
  if (canCloud) {
    try {
      const result = await api<SubmissionResult>('/submissions', {
        method: 'POST',
        body: JSON.stringify({ lessonId, exerciseId: exercise.id, answer }),
      });
      if (result.isCorrect) store.applyXp(result.totalXp, result.level);
      return result;
    } catch {
      /* Offline hashes only — do not trust leftover plaintext keys. */
    }
  }

  const localCorrect = await isAnswerCorrect(answer, undefined, exercise.answerHashes);
  const xpAwarded = localCorrect ? exercise.xpReward : 0;
  const totalXp = store.xp + xpAwarded;
  const optimistic: SubmissionResult = {
    id: 'local',
    lessonId,
    exerciseId: exercise.id,
    isCorrect: localCorrect,
    xpAwarded,
    explanation: exercise.explanation,
    totalXp,
    level: xpToLevel(totalXp),
  };

  if (localCorrect) store.applyXp(optimistic.totalXp, optimistic.level);
  void enqueue({
    type: 'submission',
    path: '/submissions',
    payload: { lessonId, exerciseId: exercise.id, answer },
  })
    .then(() => scheduleCloudSync())
    .catch(() => undefined);
  return optimistic;
}

export async function completeLesson(lessonId: string) {
  const store = useLearnerStore.getState();
  const alreadyDone = store.completedLessonIds.includes(lessonId);
  const xpAwarded = alreadyDone ? 0 : 40;
  const totalXp = store.xp + xpAwarded;
  const level = xpToLevel(totalXp);
  store.markLessonComplete(lessonId);
  if (!store.badges.some((badge) => badge.badgeType === 'first_lesson')) {
    store.addBadge({
      id: 'first-lesson',
      learnerId: store.learnerId ?? 'local-guest',
      badgeType: 'first_lesson',
      earnedAt: new Date().toISOString(),
    });
  }
  store.applyXp(totalXp, level);
  void enqueue({
    type: 'lesson_complete',
    path: `/lessons/${lessonId}/complete`,
    payload: { lessonId },
  })
    .then(() => scheduleCloudSync())
    .catch(() => undefined);
  return { xpAwarded, accuracy: 0, totalXp, level, badges: ['first_lesson'] };
}

export async function refreshMe() {
  const token = useLearnerStore.getState().token;
  if (!token || isLocalToken(token) || cloudRecentlyDown()) return;
  try {
    const me = await api<AuthLearner>('/auth/me');
    const current = useLearnerStore.getState();
    if (!current.token || isLocalToken(current.token)) return;
    current.applyAuth(current.token, me);
  } catch {
    useLearnerStore.getState().downgradeToLocal();
  }
}
