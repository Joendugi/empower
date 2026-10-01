import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MaterialKind = 'image' | 'video' | 'link' | 'file' | 'note';

export interface Campus {
  id: string;
  name: string;
  county: string;
  joinCode: string;
  educatorEmail: string;
  educatorName: string;
  createdAt: string;
}

export interface CampusClass {
  id: string;
  campusId: string;
  title: string;
  programmeId: string;
  programmeTitle: string;
  joinCode: string;
  createdAt: string;
}

export interface RosterMember {
  id: string;
  classId: string;
  name: string;
  email: string;
  phone?: string;
  joinedAt: string;
  sample?: boolean;
}

export interface ClassMaterial {
  id: string;
  classId: string;
  kind: MaterialKind;
  title: string;
  body?: string;
  url?: string;
  assetId?: string;
  createdAt: string;
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  correct: 'a' | 'b' | 'c' | 'd';
}

export interface ClassExam {
  id: string;
  classId: string;
  title: string;
  due: string;
  published: boolean;
  questions: ExamQuestion[];
  createdAt: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  classId: string;
  learnerEmail: string;
  learnerName: string;
  answers: Record<string, 'a' | 'b' | 'c' | 'd'>;
  score: number;
  max: number;
  submittedAt: string;
}

export interface ClassResult {
  id: string;
  classId: string;
  learnerEmail: string;
  learnerName: string;
  title: string;
  score: number;
  max: number;
  remark: string;
  examId?: string;
  recordedBy: string;
  recordedAt: string;
}

interface HubState {
  campuses: Campus[];
  classes: CampusClass[];
  roster: RosterMember[];
  materials: ClassMaterial[];
  exams: ClassExam[];
  attempts: ExamAttempt[];
  results: ClassResult[];
  createCampus: (input: Omit<Campus, 'id' | 'joinCode' | 'createdAt'>) => Campus;
  createClass: (input: Omit<CampusClass, 'id' | 'joinCode' | 'createdAt'>) => CampusClass;
  addLearner: (input: Omit<RosterMember, 'id' | 'joinedAt'>) => RosterMember | null;
  joinClass: (joinCode: string, learner: { name: string; email: string; phone?: string }) => CampusClass | null;
  addMaterial: (input: Omit<ClassMaterial, 'id' | 'createdAt'>) => ClassMaterial;
  addExam: (input: Omit<ClassExam, 'id' | 'createdAt'>) => ClassExam;
  setExamPublished: (examId: string, published: boolean) => void;
  submitExam: (input: Omit<ExamAttempt, 'id' | 'submittedAt' | 'score' | 'max'> & { score?: number; max?: number }) => ExamAttempt;
  recordResult: (input: Omit<ClassResult, 'id' | 'recordedAt'>) => ClassResult;
}

function nid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function code(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

const sampleCampus: Campus = {
  id: 'campus-ntti',
  name: 'Nairobi Technical Training Institute',
  county: 'Nairobi',
  joinCode: 'NTTI26',
  educatorEmail: 'sample.trainer@empower.ke',
  educatorName: 'Sample trainer',
  createdAt: '2026-01-15T08:00:00.000Z',
};

const sampleClass: CampusClass = {
  id: 'class-plb-morning',
  campusId: 'campus-ntti',
  title: 'Plumbing L5 — morning stream',
  programmeId: 'plumbing',
  programmeTitle: 'Plumbing',
  joinCode: 'PLB501',
  createdAt: '2026-01-15T08:00:00.000Z',
};

const sampleRoster: RosterMember[] = [
  { id: 'mem-amina', classId: sampleClass.id, name: 'Amina Otieno', email: 'amina.otieno@learner.ke', phone: '0712 000 001', joinedAt: '2026-02-01T07:00:00.000Z', sample: true },
  { id: 'mem-brian', classId: sampleClass.id, name: 'Brian Mwangi', email: 'brian.mwangi@learner.ke', phone: '0722 000 002', joinedAt: '2026-02-01T07:05:00.000Z', sample: true },
  { id: 'mem-faith', classId: sampleClass.id, name: 'Faith Wanjiku', email: 'faith.wanjiku@learner.ke', phone: '0733 000 003', joinedAt: '2026-02-01T07:10:00.000Z', sample: true },
];

const sampleMaterials: ClassMaterial[] = [
  {
    id: 'mat-trap-photo',
    classId: sampleClass.id,
    kind: 'image',
    title: 'P-trap side view — seal must be visible',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/P-trap.jpg',
    body: 'Use this still on the board. Learners photograph their own trap from the same angle.',
    createdAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'mat-demo-video',
    classId: sampleClass.id,
    kind: 'video',
    title: 'Instructor-led isolation demo',
    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    body: 'Watch before the workshop. Pause at the stopcock tag.',
    createdAt: '2026-03-01T08:10:00.000Z',
  },
  {
    id: 'mat-cdacc-link',
    classId: sampleClass.id,
    kind: 'link',
    title: 'CDACC plumber unit notes',
    url: 'https://www.cdacc.go.ke/',
    body: 'Official occupational standard. Do not print a photo of this page into a PDF.',
    createdAt: '2026-03-01T08:20:00.000Z',
  },
];

const sampleExam: ClassExam = {
  id: 'exam-trap-cat',
  classId: sampleClass.id,
  title: 'CAT 1 — Traps and waste',
  due: '2026-09-30',
  published: true,
  createdAt: '2026-03-04T08:00:00.000Z',
  questions: [
    {
      id: 'q1',
      prompt: 'The main purpose of a P-trap is to:',
      options: ['Raise pressure', 'Hold a water seal that blocks sewer gas', 'Earth the tap', 'Filter fluoride'],
      correct: 'b',
    },
    {
      id: 'q2',
      prompt: 'A dry guest-bath trap should first be:',
      options: ['Painted', 'Primed with water, then diagnosed', 'Connected to a drinking tap', 'Ignored'],
      correct: 'b',
    },
  ],
};

const sampleResults: ClassResult[] = [
  {
    id: 'res-faith',
    classId: sampleClass.id,
    learnerEmail: 'faith.wanjiku@learner.ke',
    learnerName: 'Faith Wanjiku',
    title: 'Isolation quiz',
    score: 92,
    max: 100,
    remark: 'Clear tagged-stopcock photo.',
    recordedBy: 'Sample trainer',
    recordedAt: '2026-09-18T16:20:00.000Z',
  },
];

export const useCampusHub = create<HubState>()(
  persist(
    (set, get) => ({
      campuses: [sampleCampus],
      classes: [sampleClass],
      roster: sampleRoster,
      materials: sampleMaterials,
      exams: [sampleExam],
      attempts: [],
      results: sampleResults,
      createCampus: (input) => {
        const next: Campus = {
          ...input,
          id: nid('campus'),
          joinCode: code('C'),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ campuses: [next, ...state.campuses] }));
        return next;
      },
      createClass: (input) => {
        const next: CampusClass = {
          ...input,
          id: nid('class'),
          joinCode: code('K'),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ classes: [next, ...state.classes] }));
        return next;
      },
      addLearner: (input) => {
        const email = input.email.trim().toLowerCase();
        if (!email) return null;
        if (get().roster.some((item) => item.classId === input.classId && item.email === email)) return null;
        const next: RosterMember = { ...input, email, id: nid('mem'), joinedAt: new Date().toISOString() };
        set((state) => ({ roster: [...state.roster, next] }));
        return next;
      },
      joinClass: (joinCode, learner) => {
        const needle = joinCode.trim().toUpperCase();
        const room = get().classes.find((item) => item.joinCode.toUpperCase() === needle);
        if (!room) return null;
        get().addLearner({ classId: room.id, name: learner.name, email: learner.email, phone: learner.phone });
        return room;
      },
      addMaterial: (input) => {
        const next: ClassMaterial = { ...input, id: nid('mat'), createdAt: new Date().toISOString() };
        set((state) => ({ materials: [next, ...state.materials] }));
        return next;
      },
      addExam: (input) => {
        const next: ClassExam = { ...input, id: nid('exam'), createdAt: new Date().toISOString() };
        set((state) => ({ exams: [next, ...state.exams] }));
        return next;
      },
      setExamPublished: (examId, published) => {
        set((state) => ({
          exams: state.exams.map((item) => (item.id === examId ? { ...item, published } : item)),
        }));
      },
      submitExam: (input) => {
        const exam = get().exams.find((item) => item.id === input.examId);
        const max = input.max ?? exam?.questions.length ?? 0;
        const score =
          input.score ??
          (exam?.questions.filter((question) => input.answers[question.id] === question.correct).length ?? 0);
        const next: ExamAttempt = {
          ...input,
          id: nid('try'),
          score,
          max,
          submittedAt: new Date().toISOString(),
        };
        set((state) => ({
          attempts: [...state.attempts.filter((item) => !(item.examId === next.examId && item.learnerEmail === next.learnerEmail)), next],
        }));
        get().recordResult({
          classId: next.classId,
          learnerEmail: next.learnerEmail,
          learnerName: next.learnerName,
          title: exam?.title ?? 'Exam',
          score,
          max,
          remark: 'Autograded campus exam',
          examId: next.examId,
          recordedBy: 'Exam',
        });
        return next;
      },
      recordResult: (input) => {
        const next: ClassResult = { ...input, id: nid('res'), recordedAt: new Date().toISOString() };
        set((state) => ({
          results: [
            next,
            ...state.results.filter(
              (item) =>
                !(
                  item.classId === input.classId &&
                  item.learnerEmail.toLowerCase() === input.learnerEmail.toLowerCase() &&
                  item.title === input.title
                )
            ),
          ],
        }));
        return next;
      },
    }),
    { name: 'empower-campus-hub' }
  )
);

export function classesForEducator(email: string) {
  const { campuses, classes } = useCampusHub.getState();
  const mine = new Set(
    campuses.filter((item) => item.educatorEmail.toLowerCase() === email.toLowerCase()).map((item) => item.id)
  );
  return classes.filter((item) => mine.has(item.campusId) || item.id === 'class-plb-morning');
}

export function classesForLearner(email: string) {
  const { roster, classes } = useCampusHub.getState();
  const ids = roster.filter((item) => item.email.toLowerCase() === email.toLowerCase()).map((item) => item.classId);
  return classes.filter((item) => ids.includes(item.id));
}
