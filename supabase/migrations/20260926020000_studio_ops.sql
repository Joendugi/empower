-- Studio, moderation, analytics, and ops tables for Empower.
-- Apply only to the Empower project, never a marketplace/wallet database.

create table if not exists public.published_lessons (
  id text primary key,
  path_id text not null,
  owner_id text not null references public.learners (id),
  raw_json text not null,
  public_json text not null,
  content_version varchar(64) not null,
  updated_at timestamptz not null default now()
);
create index if not exists ix_published_lessons_path_id on public.published_lessons (path_id);
create index if not exists ix_published_lessons_owner_id on public.published_lessons (owner_id);

create table if not exists public.published_paths (
  id text primary key,
  owner_id text not null references public.learners (id),
  payload_json text not null,
  content_version varchar(64) not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.curriculum_drafts (
  id text primary key,
  owner_id text not null references public.learners (id),
  payload_json text not null,
  updated_at timestamptz not null default now()
);
create index if not exists ix_curriculum_drafts_owner_id on public.curriculum_drafts (owner_id);

create table if not exists public.educator_applications (
  id text primary key,
  user_id text,
  email varchar(320) not null,
  payload_json text not null,
  status varchar(20) not null default 'pending',
  updated_at timestamptz not null default now()
);
create unique index if not exists uq_educator_applications_email on public.educator_applications (email);

create table if not exists public.curriculum_proposals (
  id text primary key,
  educator_id text,
  payload_json text not null,
  status varchar(20) not null default 'pending',
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id text primary key,
  learner_id text,
  event_type varchar(40) not null,
  path_id varchar(200),
  lesson_id varchar(200),
  at timestamptz not null default now()
);
create index if not exists ix_analytics_events_type on public.analytics_events (event_type);
create index if not exists ix_analytics_events_path_id on public.analytics_events (path_id);
create index if not exists ix_analytics_events_at on public.analytics_events (at);

create table if not exists public.error_events (
  id text primary key,
  message varchar(500) not null,
  path varchar(300),
  created_at timestamptz not null default now()
);
create index if not exists ix_error_events_created_at on public.error_events (created_at);

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'published_lessons',
    'published_paths',
    'curriculum_drafts',
    'educator_applications',
    'curriculum_proposals',
    'analytics_events',
    'error_events'
  ]
  loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('revoke all on table public.%I from anon, authenticated, public', tbl);
    execute format('grant all on table public.%I to service_role', tbl);
  end loop;
end
$$;
