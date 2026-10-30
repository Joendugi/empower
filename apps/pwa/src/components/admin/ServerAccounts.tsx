import { FormEvent, useEffect, useState } from 'react';
import type { AccountRole } from '@cyberlearn/types';
import { api, ApiError } from '@/lib/api';
import { useLearnerStore } from '@/store/learnerStore';

interface Account {
  id: string;
  email: string | null;
  displayName: string;
  role: AccountRole;
  emailVerified: boolean;
  totalXp: number;
}

const fieldClass = 'w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-3';

const ROLE_LABELS: Record<AccountRole, string> = {
  learner: 'Learner',
  educator: 'Educator',
  admin: 'Admin',
};

/** Roles are stored on the server. Changing one signs that person out everywhere so it applies at once. */
export default function ServerAccounts() {
  const myId = useLearnerStore((state) => state.learnerId);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<AccountRole | ''>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  const load = async (q = query, role = roleFilter) => {
    setLoading(true);
    setNote('');
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (role) params.set('role', role);
      setAccounts(await api<Account[]>(`/admin/accounts?${params.toString()}`));
    } catch (error) {
      setNote(error instanceof ApiError ? error.message : 'Could not load accounts. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Load once on open; later loads come from the search form.
  useEffect(() => {
    void load('', '');
  }, []);

  const search = (event: FormEvent) => {
    event.preventDefault();
    void load();
  };

  const changeRole = async (account: Account, role: AccountRole) => {
    setNote('');
    try {
      const updated = await api<Account>(`/admin/accounts/${account.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      setAccounts((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      setNote(`${updated.displayName} is now ${ROLE_LABELS[updated.role].toLowerCase()}. They'll need to sign in again.`);
    } catch (error) {
      setNote(error instanceof ApiError ? error.message : 'Could not change the role.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Accounts and roles</h2>
        <p className="text-sm text-muted mt-2">
          Roles are kept on the server, so they apply on every device. Educators grade work and publish lessons;
          admins also manage accounts and the catalogue.
        </p>
      </div>
      <form className="card grid md:grid-cols-[1fr_auto_auto] gap-3 items-end" onSubmit={search}>
        <label className="text-xs text-muted" htmlFor="account-search">
          Name or email
          <input
            id="account-search"
            className={`${fieldClass} mt-1`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="amina@college.ac.ke"
          />
        </label>
        <label className="text-xs text-muted" htmlFor="account-role-filter">
          Role
          <select
            id="account-role-filter"
            className={`${fieldClass} mt-1 min-w-36`}
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as AccountRole | '')}
          >
            <option value="">Any role</option>
            <option value="learner">Learners</option>
            <option value="educator">Educators</option>
            <option value="admin">Admins</option>
          </select>
        </label>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
      {note && <p className="text-sm text-muted">{note}</p>}
      <div className="grid gap-3">
        {!loading && accounts.length === 0 && <p className="text-sm text-muted">No accounts match.</p>}
        {accounts.map((account) => (
          <article key={account.id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">{account.displayName}</h3>
              <p className="text-xs text-muted">
                {account.email}
                {account.emailVerified ? '' : ' · email not confirmed'}
              </p>
            </div>
            {account.id === myId ? (
              <span className="text-xs uppercase text-accent font-semibold">You · {ROLE_LABELS[account.role]}</span>
            ) : (
              <label className="text-xs text-muted" htmlFor={`role-${account.id}`}>
                Role
                <select
                  id={`role-${account.id}`}
                  className={`${fieldClass} mt-1 min-w-36`}
                  value={account.role}
                  onChange={(event) => void changeRole(account, event.target.value as AccountRole)}
                >
                  <option value="learner">Learner</option>
                  <option value="educator">Educator</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
