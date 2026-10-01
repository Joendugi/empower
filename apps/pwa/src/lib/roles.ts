import { isEducator, isStaff } from '@/lib/localAccounts';
import { useLearnerStore } from '@/store/learnerStore';
import { useModerationStore } from '@/store/moderationStore';

export function useIsEducator() {
  const email = useLearnerStore((state) => state.email);
  const approved = useModerationStore((state) =>
    state.applications.some(
      (item) => item.email.toLowerCase() === (email ?? '').toLowerCase() && item.status === 'approved'
    )
  );
  return isEducator(email) || (approved && !isStaff(email));
}

export function useIsStaff() {
  const email = useLearnerStore((state) => state.email);
  return isStaff(email);
}

export function useCanEditCatalogue() {
  const email = useLearnerStore((state) => state.email);
  const approved = useModerationStore((state) =>
    state.applications.some(
      (item) => item.email.toLowerCase() === (email ?? '').toLowerCase() && item.status === 'approved'
    )
  );
  return isStaff(email) || approved;
}
