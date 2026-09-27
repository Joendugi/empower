// ─────────────────────────────────────────────────────────
// CyberLearn — Shared TypeScript Types
// ─────────────────────────────────────────────────────────

// ── Learner ────────────────────────────────────────────────
export interface Learner {
  id: string;
  email: string;
  displayName: string;
  createdAt: string; // ISO 8601
  preferredLanguage: 'en' | 'sw';
  totalXp: number;
  level: number;
}

// ── XP / Gamification ─────────────────────────────────────
export type XPSource =
  | 'exercise_correct'
  | 'exercise_first_try'
  | 'streak_bonus'
  | 'badge_earned'
  | 'review_card'
  | 'lesson_complete'
  | 'path_complete';

export interface XPEvent {
  id: string;
  learnerId: string;
  amount: number;
  source: XPSource;
  contentId?: string;
  createdAt: string;
}

export interface XPSummary {
  learnerId: string;
  totalXp: number;
  level: number;
  xpToNextLevel: number;
}

// ── Streaks ────────────────────────────────────────────────
export interface Streak {
  learnerId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null; // YYYY-MM-DD
  freezeTokensRemaining: number;
}

// ── Badges (OpenBadges v3 compatible) ─────────────────────
export type BadgeType =
  | 'first_lesson'
  | 'streak_7'
  | 'streak_30'
  | 'path_complete'
  | 'unit_complete'
  | 'lab_complete'
  | 'ctf_flag'
  | 'top_leaderboard'
  | 'community_contributor';

export interface Badge {
  id: string;
  learnerId: string;
  badgeType: BadgeType;
  earnedAt: string;
  openBadgesJson?: Record<string, unknown>; // OpenBadges v3 credential
}

// ── FSRS Spaced Repetition ────────────────────────────────
export type FSRSState = 'New' | 'Learning' | 'Review' | 'Relearning';

export interface FSRSCard {
  id: string;
  learnerId: string;
  contentId: string; // exercise or concept ID
  stability: number;   // days until 90% retention
  difficulty: number;  // 0.1 (easy) → 1.0 (hard)
  dueDate: string;     // YYYY-MM-DD
  lastReview: string | null;
  reps: number;
  lapses: number;
  state: FSRSState;
}

export type FSRSRating = 1 | 2 | 3 | 4; // Again | Hard | Good | Easy

// ── Exercises ─────────────────────────────────────────────
export type MediaKind = 'video' | 'audio' | 'animation' | 'image';
export type AnimationPreset = 'pulse' | 'gear' | 'wave' | 'weld' | 'stitch' | 'circuit';

export interface MediaAsset {
  kind: MediaKind;
  url?: string;
  preset?: AnimationPreset;
  caption?: string;
  mustFinish?: boolean;
}

export type ExerciseType =
  | 'MULTIPLE_CHOICE'
  | 'DRAG_DROP'
  | 'FILL_BLANK'
  | 'TERMINAL_SIM'
  | 'MATCH_PAIRS'
  | 'SCENARIO'
  | 'DIAGRAM_LABEL'
  | 'MEDIA'
  | 'VIDEO_RECORD'
  | 'AUDIO_RECORD'
  | 'PHOTO_CAPTURE';

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface MatchPair {
  left: ExerciseOption;
  right: ExerciseOption;
}

export interface DiagramSlot {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  options?: ExerciseOption[];
  correctAnswer?: string | string[];
  answerHashes?: string[];
  hint?: string;
  explanation?: string;
  xpReward: number;
  terminalResponses?: Record<string, string>;
  pairs?: MatchPair[];
  dragItems?: ExerciseOption[];
  diagramSlots?: DiagramSlot[];
  /** Named cutaway used by the web study diagrams (vehicle anatomy, etc.). */
  diagramKind?: string;
  media?: MediaAsset[];
  /** Workshop checklist the learner must confirm before submitting evidence. */
  rubric?: string[];
  /** Minimum recording length in seconds for VIDEO_RECORD / AUDIO_RECORD. */
  minSeconds?: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  titleSw?: string;
  briefing?: string;
  briefingSw?: string;
  /** Learner-facing week outline, one item per line. */
  outline?: string;
  weekNumber?: number;
  estimatedMinutes: number;
  exercises: Exercise[];
  cdaccUnitId?: string;
  examDomain?: string;
  xpTotal: number;
  contentVersion?: string;
  license?: string;
  media?: MediaAsset[];
}

export interface SkillNode {
  id: string;
  title: string;
  titleSw?: string;
  description?: string;
  /** Short outline shown on the course page, one item per line. */
  outline?: string;
  weekNumber?: number;
  prerequisites: string[];
  lessonIds: string[];
  badgeIds: string[];
  cdaccUnitId?: string;
  examDomain?: string;
  icon?: string;
  xpTotal?: number;
  lessonCount?: number;
  isLocked?: boolean;
  completionPercent?: number;
}

export type ProgrammeTrack = 'tvet' | 'cybersecurity' | 'trades';

export interface SkillPath {
  id: string;
  title: string;
  titleSw?: string;
  description: string;
  descriptionSw?: string;
  nodes: SkillNode[];
  certificationTarget?: string;
  track?: ProgrammeTrack;
  contentVersion?: string;
}

// ── Leaderboard ───────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  learnerId: string;
  displayName: string;
  totalXp: number;
  level: number;
}

// ── Review Sessions ───────────────────────────────────────
export interface ReviewCard {
  contentId: string;
  lessonTitle?: string;
  dueDate: string;
  reps: number;
  state?: string;
}

export interface AuthLearner {
  id: string;
  email: string | null;
  displayName: string;
  preferredLanguage: 'en' | 'sw';
  totalXp: number;
  level: number;
  isGuest: boolean;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  learner: AuthLearner;
}

export interface SubmissionResult {
  id: string;
  lessonId: string;
  exerciseId: string;
  isCorrect: boolean;
  xpAwarded: number;
  explanation?: string | null;
  totalXp: number;
  level: number;
}

export interface ReviewSession {
  learnerId: string;
  cards: ReviewCard[];
  generatedAt: string;
}

export interface ReviewResult {
  learnerId: string;
  contentId: string;
  rating: FSRSRating;
}
