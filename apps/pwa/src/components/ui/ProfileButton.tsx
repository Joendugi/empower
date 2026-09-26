import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
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
      className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-accent/20 to-surface-light border border-accent/40 text-accent text-xs font-bold flex items-center justify-center shrink-0 hover:scale-105 hover:border-accent hover:shadow-[0_0_15px_rgba(0,212,170,0.3)] transition-all"
      aria-label={t('profile')}
      title={t('profile')}
    >
      {token ? (
        <span>{initials(displayName, email)}</span>
      ) : (
        <User className="w-4 h-4 text-muted hover:text-white transition-colors" />
      )}
    </Link>
  );
}
