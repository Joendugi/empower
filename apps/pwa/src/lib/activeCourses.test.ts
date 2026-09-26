import { beforeEach, describe, expect, it, vi } from 'vitest';
import { canAddActivePath, MAX_ACTIVE_COURSES, trimActivePathIds } from '@/lib/activeCourses';
import { useLearnerStore } from '@/store/learnerStore';
import { useLibraryStore } from '@/store/libraryStore';

vi.mock('@/content', () => ({
  getSkillPaths: () => [
    {
      id: 'tvet-ict-technician',
      track: 'tvet',
      title: 'TVET ICT',
      description: 'ICT',
      nodes: [],
    },
    {
      id: 'cybersecurity',
      track: 'cybersecurity',
      title: 'Cyber',
      description: 'Cyber',
      nodes: [],
    },
    {
      id: 'sewing-garment',
      track: 'trades',
      title: 'Sewing',
      description: 'Trade',
      nodes: [],
    },
  ],
}));

vi.mock('@/lib/programmePack', () => ({
  findPathForLesson: () => undefined,
  listSavedPacks: async () => [],
  prefetchLessonPack: async () => undefined,
  readCachedLesson: async () => undefined,
  saveProgrammePack: async (path: { id: string }) => ({
    id: path.id,
    path,
    lessonIds: [],
    status: 'ready',
    lessonsReady: 0,
    mediaReady: 0,
    mediaTotal: 0,
    cachedAt: new Date().toISOString(),
  }),
}));

describe('active course cap helpers', () => {
  it('trims to the last two unique ids', () => {
    expect(trimActivePathIds(['a', 'b', 'c'])).toEqual(['b', 'c']);
    expect(trimActivePathIds(['a', 'a', 'b'])).toEqual(['a', 'b']);
    expect(MAX_ACTIVE_COURSES).toBe(2);
  });

  it('allows trades and jobseeker-style paths under the same cap', () => {
    expect(canAddActivePath([], 'sewing-garment')).toBe(true);
    expect(canAddActivePath(['tvet-ict-technician'], 'sewing-garment')).toBe(true);
    expect(canAddActivePath(['tvet-ict-technician', 'cybersecurity'], 'sewing-garment')).toBe(false);
    expect(canAddActivePath(['tvet-ict-technician', 'sewing-garment'], 'sewing-garment')).toBe(true);
  });
});

describe('learnerStore course slots', () => {
  beforeEach(() => {
    localStorage.clear();
    useLearnerStore.setState({
      chosenPathIds: [],
      onboardingCompleted: false,
      learnerRole: null,
      learnerGoal: null,
      preferredTrack: null,
    });
    useLibraryStore.setState({ selectedIds: [], packs: {}, lessons: {}, hydrated: false });
  });

  it('accepts two courses then blocks a third', () => {
    expect(useLearnerStore.getState().choosePath('tvet-ict-technician')).toBe(true);
    expect(useLearnerStore.getState().choosePath('sewing-garment')).toBe(true);
    expect(useLearnerStore.getState().choosePath('cybersecurity')).toBe(false);
    expect(useLearnerStore.getState().chosenPathIds).toEqual([
      'tvet-ict-technician',
      'sewing-garment',
    ]);
  });

  it('lets a trades path occupy a slot the same way as TVET', () => {
    expect(useLearnerStore.getState().choosePath('sewing-garment')).toBe(true);
    expect(useLearnerStore.getState().canChoosePath('cybersecurity')).toBe(true);
    expect(useLearnerStore.getState().chosenPathIds).toContain('sewing-garment');
  });

  it('frees a slot when leaving a course', () => {
    useLearnerStore.getState().choosePath('tvet-ict-technician');
    useLearnerStore.getState().choosePath('cybersecurity');
    useLearnerStore.getState().leavePath('tvet-ict-technician');
    expect(useLearnerStore.getState().chosenPathIds).toEqual(['cybersecurity']);
    expect(useLearnerStore.getState().choosePath('sewing-garment')).toBe(true);
    expect(useLearnerStore.getState().chosenPathIds).toEqual(['cybersecurity', 'sewing-garment']);
  });

  it('trims overflow when syncing library active programmes', () => {
    useLibraryStore.getState().syncActiveProgrammes([
      'tvet-ict-technician',
      'cybersecurity',
      'sewing-garment',
    ]);
    expect(useLibraryStore.getState().selectedIds).toEqual(['cybersecurity', 'sewing-garment']);
  });
});
