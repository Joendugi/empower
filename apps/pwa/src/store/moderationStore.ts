import type { Lesson, SkillPath } from '@cyberlearn/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface EducatorApplication {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  phone: string;
  county: string;
  institution: string;
  tradeAreas: string;
  qualifications: string;
  experienceYears: number;
  statement: string;
  status: ReviewStatus;
  reviewerNote?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface CurriculumProposal {
  id: string;
  educatorId: string;
  educatorName: string;
  educatorEmail: string;
  path: SkillPath;
  lesson: Lesson;
  lessons?: Lesson[];
  sourceReferences: string[];
  learningOutcomes: string[];
  status: ReviewStatus;
  reviewerNote?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export function proposalLessons(proposal: CurriculumProposal) {
  return proposal.lessons?.length ? proposal.lessons : [proposal.lesson];
}

interface ModerationState {
  applications: EducatorApplication[];
  proposals: CurriculumProposal[];
  submitApplication: (application: Omit<EducatorApplication, 'id' | 'status' | 'submittedAt'>) => void;
  reviewApplication: (id: string, status: Exclude<ReviewStatus, 'pending'>, note?: string) => void;
  submitProposal: (proposal: Omit<CurriculumProposal, 'id' | 'status' | 'submittedAt'>) => void;
  reviewProposal: (id: string, status: Exclude<ReviewStatus, 'pending'>, note?: string) => void;
}

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function validateProposal(proposal: CurriculumProposal) {
  const lessons = proposalLessons(proposal);
  const notesWords = lessons.reduce(
    (sum, lesson) => sum + (lesson.briefing ?? '').trim().split(/\s+/).filter(Boolean).length,
    0
  );
  const exercises = lessons.flatMap((lesson) => lesson.exercises);
  const media = [
    ...lessons.flatMap((lesson) => lesson.media ?? []),
    ...exercises.flatMap((item) => item.media ?? []),
  ];
  const checks = [
    { label: 'At least two measurable learning outcomes', pass: proposal.learningOutcomes.length >= 2 },
    { label: 'Detailed study notes (at least 80 words across weeks)', pass: notesWords >= 80 },
    { label: 'Week outline for learners', pass: lessons.every((lesson) => Boolean(lesson.outline?.trim()) || Boolean(lesson.briefing?.trim())) },
    { label: 'At least one autograded question', pass: exercises.some((item) => item.type === 'MULTIPLE_CHOICE' || item.type === 'FILL_BLANK') },
    {
      label: 'Every assessment has an explanation or practical rubric',
      pass: exercises.every((exercise) => Boolean(exercise.explanation?.trim()) || Boolean(exercise.rubric?.length)),
    },
    {
      label: 'External media uses HTTPS',
      pass: media
        .filter((asset) => asset.url && !asset.url.startsWith('idb:') && !asset.url.startsWith('/'))
        .every((asset) => asset.url?.startsWith('https://')),
    },
  ];
  return { checks, valid: checks.every((check) => check.pass) };
}

export const useModerationStore = create<ModerationState>()(
  persist(
    (set) => ({
      applications: [],
      proposals: [],
      submitApplication: (application) => {
        set((state) => ({
          applications: [
            ...state.applications.filter((item) => item.email.toLowerCase() !== application.email.toLowerCase()),
            { ...application, id: id('educator'), status: 'pending', submittedAt: new Date().toISOString() },
          ],
        }));
        void import('@/lib/syncEngine').then((mod) => mod.scheduleCloudSync());
      },
      reviewApplication: (applicationId, status, reviewerNote) => {
        set((state) => ({
          applications: state.applications.map((item) =>
            item.id === applicationId
              ? { ...item, status, reviewerNote, reviewedAt: new Date().toISOString() }
              : item
          ),
        }));
        void import('@/lib/syncEngine').then((mod) => mod.scheduleCloudSync());
      },
      submitProposal: (proposal) => {
        set((state) => ({
          proposals: [
            ...state.proposals,
            { ...proposal, id: id('proposal'), status: 'pending', submittedAt: new Date().toISOString() },
          ],
        }));
        void import('@/lib/syncEngine').then((mod) => mod.scheduleCloudSync());
      },
      reviewProposal: (proposalId, status, reviewerNote) => {
        set((state) => ({
          proposals: state.proposals.map((item) =>
            item.id === proposalId
              ? { ...item, status, reviewerNote, reviewedAt: new Date().toISOString() }
              : item
          ),
        }));
        void import('@/lib/syncEngine').then((mod) => mod.scheduleCloudSync());
      },
    }),
    { name: 'empower-moderation' }
  )
);
