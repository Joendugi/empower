import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TeachingMethod =
  | 'instructor-led'
  | 'guided-practice'
  | 'peer-critique'
  | 'site-visit'
  | 'mastery-signoff';

export type SubmissionKind = 'practical' | 'assignment' | 'quiz';
export type GradeStatus = 'pending' | 'returned' | 'passed' | 'failed';

export const TEACHING_METHODS: { id: TeachingMethod; label: string; hint: string }[] = [
  { id: 'instructor-led', label: 'Instructor-led demo', hint: 'Trainer shows the whole sequence, then learners copy.' },
  { id: 'guided-practice', label: 'Guided workshop practice', hint: 'Pairs work while the trainer walks the benches.' },
  { id: 'peer-critique', label: 'Peer critique', hint: 'Learners score each other against the same rubric.' },
  { id: 'site-visit', label: 'Community / site visit', hint: 'Real job, same stop points as the workshop.' },
  { id: 'mastery-signoff', label: 'Mastery sign-off', hint: 'Trainer grades evidence. Learner does not self-pass.' },
];

export interface LibraryNote {
  id: string;
  programmeId: string;
  programmeTitle: string;
  slug?: string;
  title: string;
  body: string;
  method: TeachingMethod;
  outcomes: string[];
  educatorEmail: string;
  educatorName: string;
  sample?: boolean;
  createdAt: string;
}

export interface TeachingVariation {
  id: string;
  programmeId: string;
  programmeTitle: string;
  title: string;
  method: TeachingMethod;
  durationMinutes: number;
  sequence: string[];
  materials: string[];
  checks: string[];
  educatorEmail: string;
  educatorName: string;
  sample?: boolean;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  learnerName: string;
  learnerEmail: string;
  programmeId: string;
  programmeTitle: string;
  lessonTitle: string;
  kind: SubmissionKind;
  evidence: string;
  submittedAt: string;
  status: GradeStatus;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
  sample?: boolean;
}

interface EducatorState {
  notes: LibraryNote[];
  variations: TeachingVariation[];
  submissions: AssignmentSubmission[];
  addNote: (note: Omit<LibraryNote, 'id' | 'createdAt'>) => LibraryNote;
  addVariation: (variation: Omit<TeachingVariation, 'id' | 'createdAt'>) => TeachingVariation;
  gradeSubmission: (
    id: string,
    input: { status: Exclude<GradeStatus, 'pending'>; score?: number; feedback: string; gradedBy: string }
  ) => void;
}

const SAMPLE_NOTE_ID = 'sample-note-plumbing-waste';
const SAMPLE_METHOD_ID = 'sample-method-plumbing-waste';

const sampleNote: LibraryNote = {
  id: SAMPLE_NOTE_ID,
  programmeId: 'plumbing',
  programmeTitle: 'Plumbing',
  slug: 'plumbing-waste',
  title: 'P-trap seal — instructor-led workshop (sample)',
  method: 'instructor-led',
  educatorEmail: 'sample.trainer@empower.ke',
  educatorName: 'Sample trainer',
  sample: true,
  createdAt: '2026-01-15T08:00:00.000Z',
  outcomes: [
    'Restore a water seal on a dry basin trap and explain why the room smelled.',
    'Set a 32 mm waste run to a teaching fall of about 1:40 and clip it so it cannot sag.',
    'Separate soil tools from potable tools and name the PPE used.',
  ],
  body: `This is a trainer note, not a learner course. Learners still sit the graded lesson. You use this sheet on the bench.

Outcomes (must be visible on the board before the demo)
• Restore a water seal and say what sewer gas the seal blocks.
• Set fall on a short waste run and prove it with a spirit level, not “it looks downhill”.
• Keep soil tools off kitchen taps.

PPE and stop points
Gloves, eye protection, and a wash after soil work. If the trap is live to a stack with tenants above, stop — mechanical clear only as trained. Do not mix unknown drain chemicals. If someone opens an upstream valve on your open joint, that is a flood: tag the isolator.

Local kit (Nairobi / county hardware, not a catalogue photo)
32 mm P-trap and waste, PTFE, clips, bucket, dye or food colour, spirit level, rag kept only for soil. Write the receipt date on the job card. If the trap is undersized or missing a dip, reject it before learners copy a fault.

Instructor-led sequence (55 minutes)
1. Smell the dry guest-bath trap. Ask why incense is not a repair.
2. Demo: prime 500 ml, then run the basin and watch the seal hold.
3. Dry it again. Learners prime in pairs while you walk the benches.
4. Set a 600 mm waste offcut to fall. Backfall fails the check, even if it “drains slowly”.
5. One fixture at a time to find a stain. Condensation is a hypothesis, not a pass.

Common faults to name out loud
Dry trap from disuse. Missing clip so the run sags overnight. Cross-connection into potable. Rag from the gully used on a drinking tap. Chemical “clear” with people on the floor above.

Evidence you will grade
Photo of the primed trap from the side (seal visible), photo of the level on the waste, and two sentences: what dried the trap, and which tool stayed on the soil tray.

Kiswahili terms on the board
P-trap / trap, water seal / muhuri wa maji, fall / mteremko, isolate / funga valve, potable / maji ya kunywa.

Do not sit the learner quiz yourself. Grade the evidence against this sheet.`,
};

const sampleVariation: TeachingVariation = {
  id: SAMPLE_METHOD_ID,
  programmeId: 'plumbing',
  programmeTitle: 'Plumbing',
  title: 'Traps and waste — instructor-led then pair practice (sample)',
  method: 'instructor-led',
  durationMinutes: 90,
  educatorEmail: 'sample.trainer@empower.ke',
  educatorName: 'Sample trainer',
  sample: true,
  createdAt: '2026-01-15T08:00:00.000Z',
  sequence: [
    'Board outcomes and PPE (5 min).',
    'Instructor-led demo on one basin: isolate, open, prime, prove seal (20 min).',
    'Guided pair practice on the next two basins. Trainer does not leave the aisle (35 min).',
    'Peer critique: each pair scores another pair on seal photo + fall (15 min).',
    'Mastery sign-off: trainer grades evidence. No self-pass (15 min).',
  ],
  materials: [
    'Three practice basins or offcuts',
    '32 mm traps, clips, PTFE, bucket, dye, spirit level',
    'Soil-only rags and a potable-only rag, labelled',
    'Job cards with outcomes and stop points printed',
  ],
  checks: [
    'Seal visible in the side photo — not only a wet floor.',
    'Level shows fall. Backfall is a return, not a “nearly”.',
    'Isolator tagged. Open joint is never live.',
    'Soil tools did not touch the kitchen tap.',
  ],
};

const sampleSubmissions: AssignmentSubmission[] = [
  {
    id: 'sample-sub-amina',
    learnerName: 'Amina Otieno',
    learnerEmail: 'amina.otieno@learner.ke',
    programmeId: 'plumbing',
    programmeTitle: 'Plumbing',
    lessonTitle: 'Traps, waste, and leak diagnosis',
    kind: 'practical',
    evidence:
      'Side photo of a primed P-trap (seal visible) and a level on a 32 mm waste. Note: guest bath had been unused for two weeks; trap dried. Soil rag stayed on the yellow tray.',
    submittedAt: '2026-09-20T11:10:00.000Z',
    status: 'pending',
    sample: true,
  },
  {
    id: 'sample-sub-brian',
    learnerName: 'Brian Mwangi',
    learnerEmail: 'brian.mwangi@learner.ke',
    programmeId: 'plumbing',
    programmeTitle: 'Plumbing',
    lessonTitle: 'Traps, waste, and leak diagnosis',
    kind: 'assignment',
    evidence:
      'Wrote “I poured water and the smell stopped.” No photo of the seal, no fall check, and the same rag was used on the kitchen tap.',
    submittedAt: '2026-09-21T09:40:00.000Z',
    status: 'pending',
    sample: true,
  },
  {
    id: 'sample-sub-faith',
    learnerName: 'Faith Wanjiku',
    learnerEmail: 'faith.wanjiku@learner.ke',
    programmeId: 'plumbing',
    programmeTitle: 'Plumbing',
    lessonTitle: 'Water systems, isolation, and hygiene',
    kind: 'quiz',
    evidence: 'Autograded 4/4 on isolation and backflow. Practical photo of tagged stopcock attached.',
    submittedAt: '2026-09-18T14:05:00.000Z',
    status: 'passed',
    score: 92,
    feedback: 'Clear isolation photo and correct backflow answer. Ready for the waste unit sign-off.',
    gradedAt: '2026-09-18T16:20:00.000Z',
    gradedBy: 'Sample trainer',
    sample: true,
  },
];

function nid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useEducatorStore = create<EducatorState>()(
  persist(
    (set) => ({
      notes: [sampleNote],
      variations: [sampleVariation],
      submissions: sampleSubmissions,
      addNote: (note) => {
        const next: LibraryNote = { ...note, id: nid('note'), createdAt: new Date().toISOString() };
        set((state) => ({ notes: [next, ...state.notes] }));
        return next;
      },
      addVariation: (variation) => {
        const next: TeachingVariation = {
          ...variation,
          id: nid('method'),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ variations: [next, ...state.variations] }));
        return next;
      },
      gradeSubmission: (id, input) => {
        set((state) => ({
          submissions: state.submissions.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: input.status,
                  score: input.score,
                  feedback: input.feedback.trim(),
                  gradedAt: new Date().toISOString(),
                  gradedBy: input.gradedBy,
                }
              : item
          ),
        }));
      },
    }),
    { name: 'empower-educator-desk' }
  )
);

export function notesForProgramme(programmeId: string) {
  return useEducatorStore.getState().notes.filter((note) => note.programmeId === programmeId);
}

export function notesForSlug(slug: string) {
  return useEducatorStore.getState().notes.filter((note) => note.slug === slug);
}

export function methodLabel(method: TeachingMethod) {
  return TEACHING_METHODS.find((item) => item.id === method)?.label ?? method;
}

export const QUALITY_PRACTICES = [
  {
    title: 'Write outcomes a bench can fail',
    detail:
      '“Understand traps” is not teachable. “Restore a visible water seal and set fall on a 600 mm waste” can pass or return.',
  },
  {
    title: 'Name local kit, not catalogue kit',
    detail:
      'List the sizes, brands, and county hardware you actually have. Reject a trap with no dip before learners copy it.',
  },
  {
    title: 'Put stop points in the notes',
    detail:
      'Live stack, unknown chemical, failed isolator, tenants above — the note must say stop, not “be careful”.',
  },
  {
    title: 'Keep instructor-led and practice in one sequence',
    detail:
      'Demo, then guided pairs, then peer critique, then trainer sign-off. Do not let learners self-pass a practical.',
  },
  {
    title: 'Grade evidence, not attendance',
    detail:
      'A side photo of the seal, a level on the pipe, and two sentences beat “I was in the workshop”.',
  },
  {
    title: 'Put Kiswahili terms on the board',
    detail:
      'Seal, fall, isolate, potable — learners meet both languages in assessment and on site.',
  },
  {
    title: 'Separate soil work from drinking water',
    detail:
      'Tools, rags, and gloves for waste stay labelled. Hygiene is a competence, not housekeeping.',
  },
  {
    title: 'Return weak work with the missing check',
    detail:
      '“Smell stopped” without a seal photo is a return. Name the missing artefact so the next attempt is specific.',
  },
] as const;
