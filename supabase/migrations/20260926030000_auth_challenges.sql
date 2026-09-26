-- Auth challenges + email_verified for Empower (not marketplace).

alter table public.learners
  add column if not exists email_verified boolean not null default false;

create table if not exists public.auth_challenges (
  id text primary key,
  learner_id text not null,
  purpose varchar(40) not null,
  token_hash varchar(64) not null unique,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists ix_auth_challenges_learner_id on public.auth_challenges (learner_id);

do $$
begin
  alter table public.auth_challenges enable row level security;
  revoke all on table public.auth_challenges from anon, authenticated, public;
  grant all on table public.auth_challenges to service_role;
end
$$;
