-- Fresh Empower schema for a new empty Supabase project.
-- Do not apply this to any other product database.

create table if not exists public.learners (
  id text primary key,
  email varchar(320) unique,
  display_name varchar(100) not null,
  preferred_language varchar(5) not null default 'en',
  password_hash varchar(255),
  is_guest boolean not null default false,
  total_xp integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ix_learners_email on public.learners (email);

create table if not exists public.xp_events (
  id text primary key,
  learner_id text not null references public.learners (id),
  amount integer not null,
  source varchar(50) not null,
  content_id varchar(200),
  idempotency_key varchar(100) unique,
  created_at timestamptz not null default now()
);
create index if not exists ix_xp_events_learner_id on public.xp_events (learner_id);
create index if not exists ix_xp_events_created_at on public.xp_events (created_at);

create table if not exists public.streaks (
  learner_id text primary key references public.learners (id),
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  freeze_tokens_remaining integer not null default 2,
  freeze_tokens_last_reset date
);

create table if not exists public.badges (
  id text primary key,
  learner_id text not null references public.learners (id),
  badge_type varchar(100) not null,
  earned_at timestamptz not null default now(),
  open_badges_json text
);
create index if not exists ix_badges_learner_id on public.badges (learner_id);
create unique index if not exists ix_badges_learner_type on public.badges (learner_id, badge_type);

create table if not exists public.fsrs_cards (
  id text primary key,
  learner_id text not null references public.learners (id),
  content_id varchar(200) not null,
  stability double precision not null default 1.0,
  difficulty double precision not null default 0.3,
  due_date date not null,
  last_review date,
  reps integer not null default 0,
  lapses integer not null default 0,
  state varchar(20) not null default 'New'
);
create index if not exists ix_fsrs_cards_learner_id on public.fsrs_cards (learner_id);
create index if not exists ix_fsrs_cards_due_date on public.fsrs_cards (due_date);
create unique index if not exists ix_fsrs_learner_content on public.fsrs_cards (learner_id, content_id);
create index if not exists ix_fsrs_due_date on public.fsrs_cards (learner_id, due_date);

create table if not exists public.submissions (
  id text primary key,
  learner_id text not null references public.learners (id),
  lesson_id varchar(200) not null,
  exercise_id varchar(200) not null,
  answer text not null,
  is_correct boolean not null default false,
  xp_awarded integer not null default 0,
  idempotency_key varchar(100),
  created_at timestamptz not null default now(),
  constraint uq_submissions_idempotency_key unique (idempotency_key)
);
create index if not exists ix_submissions_learner_id on public.submissions (learner_id);
create index if not exists ix_submissions_lesson_id on public.submissions (lesson_id);
create index if not exists ix_submissions_created_at on public.submissions (created_at);

create table if not exists public.lesson_completions (
  id text primary key,
  learner_id text not null references public.learners (id),
  lesson_id varchar(200) not null,
  xp_awarded integer not null default 0,
  accuracy integer not null default 0,
  idempotency_key varchar(100),
  created_at timestamptz not null default now(),
  constraint uq_lesson_completions_learner_lesson unique (learner_id, lesson_id),
  constraint uq_lesson_completions_idempotency_key unique (idempotency_key)
);
create index if not exists ix_lesson_completions_learner_id on public.lesson_completions (learner_id);

-- Browser clients must not read learner hashes or progress via PostgREST.
-- FastAPI uses the database URI (postgres / service role) and bypasses RLS.
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'learners',
    'xp_events',
    'streaks',
    'badges',
    'fsrs_cards',
    'submissions',
    'lesson_completions'
  ]
  loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('revoke all on table public.%I from anon, authenticated, public', tbl);
    execute format('grant all on table public.%I to service_role', tbl);
  end loop;
end
$$;
