import type { AccountRole } from '@cyberlearn/types';
import {
  isEducator as isLocalEducator,
  isOwner as isLocalOwner,
  isStaff as isLocalStaff,
} from '@/lib/localAccounts';
import { useLearnerStore } from '@/store/learnerStore';
import { useModerationStore } from '@/store/moderationStore';
import { usePlatformStore } from '@/store/platformStore';

/**
 * Who the signed-in person is allowed to act as. One rule for the whole app:
 *
 * - Signed in to the server: the role the server sent (`/auth/login`, `/auth/me`).
 *   Browser storage can't change it, and the server enforces it on every call anyway.
 * - Campus mode (deploymentMode "offline"): device accounts, so a college lab works with
 *   no server. Roles come from the accounts on this device and local educator approvals.
 * - A device-only session in cloud mode is always a learner. It can't grant staff or
 *   educator screens, because nothing on the server would back them up.
 */
export interface RoleInput {
  authSource: 'local' | 'cloud' | null;
  accountRole: AccountRole | null;
  email: string | null;
  campusMode: boolean;
  approvedLocally: boolean;
}

export function resolveAccountRole(input: RoleInput): AccountRole {
  if (input.authSource === 'cloud') return input.accountRole ?? 'learner';
  if (input.authSource === 'local' && input.campusMode) {
    if (isLocalStaff(input.email)) return 'admin';
    if (isLocalEducator(input.email) || input.approvedLocally) return 'educator';
  }
  return 'learner';
}

function approvedLocally(email: string | null) {
  const needle = (email ?? '').toLowerCase();
  return useModerationStore
    .getState()
    .applications.some((item) => item.email.toLowerCase() === needle && item.status === 'approved');
}

/** Non-hook version, for code that runs right after sign-in. */
export function currentAccountRole(): AccountRole {
  const learner = useLearnerStore.getState();
  return resolveAccountRole({
    authSource: learner.authSource,
    accountRole: learner.accountRole,
    email: learner.email,
    campusMode: usePlatformStore.getState().deploymentMode === 'offline',
    approvedLocally: approvedLocally(learner.email),
  });
}

export function useAccountRole(): AccountRole {
  const authSource = useLearnerStore((state) => state.authSource);
  const accountRole = useLearnerStore((state) => state.accountRole);
  const email = useLearnerStore((state) => state.email);
  const campusMode = usePlatformStore((state) => state.deploymentMode === 'offline');
  const approved = useModerationStore((state) =>
    state.applications.some(
      (item) => item.email.toLowerCase() === (email ?? '').toLowerCase() && item.status === 'approved'
    )
  );
  return resolveAccountRole({ authSource, accountRole, email, campusMode, approvedLocally: approved });
}

/** Office staff: analytics, educator review, accounts, catalogue. */
export function useIsStaff() {
  return useAccountRole() === 'admin';
}

/** Teaching desk. Staff use the office instead, so they aren't counted here. */
export function useIsEducator() {
  return useAccountRole() === 'educator';
}

/**
 * Full office access (curriculum, settings, accounts). On the server every admin has it;
 * in campus mode only the device owner does, and other local staff are limited.
 */
export function useIsFullAdmin() {
  const role = useAccountRole();
  const authSource = useLearnerStore((state) => state.authSource);
  const email = useLearnerStore((state) => state.email);
  if (role !== 'admin') return false;
  return authSource === 'cloud' || isLocalOwner(email);
}

export function useCanEditCatalogue() {
  const role = useAccountRole();
  return role === 'admin' || role === 'educator';
}
