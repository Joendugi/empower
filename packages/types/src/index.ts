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
  /** Detailed lesson notes in Markdown. Bundled lessons load theirs lazily (see lib/lessonNotes). */
  contentMd?: string;
  weekNumber?: number;
  dayNumber?: number;
  estimatedMinutes: number;
  exercises: Exercise[];
  cdaccUnitId?: string;
  examDomain?: string;
  narrativeFrame?: string;
  storyEpisode?: string;
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
  dayNumber?: number;
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

// ── Readflix Library & Books ──────────────────────────────
export interface BookChapter {
  id: string;
  title: string;
  pageNumber: number;
  content?: string;
}

export interface Book {
  id: string;
  title: string;
  titleSw?: string;
  author: string;
  description: string;
  descriptionSw?: string;
  category: 'resilience' | 'tvet-trade' | 'health' | 'agriculture' | 'engineering' | 'technology';
  tradeId?: string;
  tradeTitle?: string;
  coverImage?: string;
  coverColor: string; // Tailwind gradient classes e.g. "from-emerald-600 to-teal-900"
  fileFormat: 'pdf' | 'epub' | 'markdown';
  fileSizeMb: number;
  totalPages: number;
  estimatedMinutes: number;
  downloadUrl?: string;
  offlineReady?: boolean;
  featured?: boolean;
  rating?: number;
  readersCount?: number;
  cdaccUnitId?: string;
  chapters?: BookChapter[];
  contentMarkdown?: string;
  publishedYear?: number;
}

export interface BookProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  percent: number;
  lastReadAt: string;
  bookmarks?: number[];
  completed?: boolean;
}

export interface BookShelf {
  reading: BookProgress[];
  savedBookIds: string[];
  offlineBookIds: string[];
}

// ── Civilization Narrative & Restoration ──────────────────
export type RebuilderRankId =
  | 'recruit'
  | 'technician'
  | 'engineer'
  | 'specialist'
  | 'architect'
  | 'commander';

export interface RebuilderRank {
  id: RebuilderRankId;
  minLevel: number;
  minXp: number;
  label: string;
  labelSw: string;
}

export interface RestorationEventData {
  nodeId: string;
  nodeTitle: string;
  nodeIcon: string;
  xpEarned: number;
  timestamp: string;
}

export interface StoryEpisodePanel {
  icon: string;
  text: string;
  textSw: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface StoryEpisodeData {
  id: string;
  title: string;
  titleSw: string;
  panels: StoryEpisodePanel[];
}

export type CompassSector = 'power' | 'comms' | 'compute' | 'data' | 'applications';
export type CompassHeading = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface CivilizationNode {
  id: string;
  title: string;
  titleSw?: string;
  description: string;
  icon: string;
  sector: CompassSector;
  isRestored: boolean;
  unlockedAt?: string;
  /** SVG coordinates on the Civilization Map (0–1000 viewBox) */
  x?: number;
  y?: number;
  /** Compass bearing in degrees (0 = North, 90 = East, 180 = South, 270 = West) */
  bearing?: number;
  /** Territory zone or region identifier e.g. "Nairobi Core", "Rift Valley Mesh" */
  region?: string;
  regionSw?: string;
  /** Connected node IDs for transmission lines */
  connections?: string[];
  /** Associated skill path or lesson ID */
  pathId?: string;
}

export interface CompassBearing {
  degrees: number;
  heading: CompassHeading;
  distanceKm: number;
}
