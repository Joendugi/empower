-- Canvas LMS Parity: Discussion Boards + Practical Rubrics
-- Apply via Supabase Dashboard SQL Editor

-- ============================================================
-- DISCUSSION BOARDS: async peer Q&A per lesson
-- ============================================================
CREATE TABLE IF NOT EXISTS discussion_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id     TEXT NOT NULL,
  learner_id    UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  author_name   TEXT NOT NULL,
  body          TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  parent_id     UUID REFERENCES discussion_posts(id) ON DELETE CASCADE,
  upvotes       INTEGER NOT NULL DEFAULT 0,
  is_pinned     BOOLEAN NOT NULL DEFAULT FALSE,
  is_resolved   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_lesson ON discussion_posts (lesson_id, created_at);
CREATE INDEX IF NOT EXISTS idx_posts_parent ON discussion_posts (parent_id) WHERE parent_id IS NOT NULL;

-- ============================================================
-- PRACTICAL RUBRICS: workshop instructor sign-off checklists
-- ============================================================
CREATE TABLE IF NOT EXISTS practical_rubrics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id     TEXT NOT NULL,
  educator_id   UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  criteria_json JSONB NOT NULL DEFAULT '[]',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rubrics_lesson ON practical_rubrics (lesson_id);

-- ============================================================
-- RUBRIC SIGN-OFFS: educator approval records per learner
-- ============================================================
CREATE TABLE IF NOT EXISTS rubric_signoffs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rubric_id       UUID NOT NULL REFERENCES practical_rubrics(id) ON DELETE CASCADE,
  learner_id      UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  educator_id     UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  criteria_met    JSONB NOT NULL DEFAULT '[]',
  evidence_note   TEXT NOT NULL DEFAULT '',
  passed          BOOLEAN NOT NULL DEFAULT FALSE,
  signed_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_signoffs_unique ON rubric_signoffs (rubric_id, learner_id);
CREATE INDEX IF NOT EXISTS idx_signoffs_learner ON rubric_signoffs (learner_id);
