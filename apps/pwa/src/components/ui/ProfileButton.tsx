import { Link } from 'react-router-dom';
import { useLearnerStore } from '@/store/learnerStore';
import { useT } from '@/i18n';

function initials(name: string | null, email: string | null) {
  const source = (name ?? email ?? 'P').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function ProfileButton() {
  const t = useT();
  const token = useLearnerStore((state) => state.token);
  const displayName = useLearnerStore((state) => state.displayName);
  const email = useLearnerStore((state) => state.email);

  return (
    <Link
      to="/profile"
      className="w-9 h-9 rounded-full bg-accent/15 border border-accent/40 text-accent text-xs font-semibold grid place-items-center shrink-0"
      aria-label={t('profile')}
      title={t('profile')}
    >
      {token ? initials(displayName, email) : '☺'}
    </Link>
  );
}
