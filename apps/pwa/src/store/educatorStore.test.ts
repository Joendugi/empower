import { beforeEach, describe, expect, it } from 'vitest';
import { useEducatorStore } from '@/store/educatorStore';

describe('educator desk', () => {
  beforeEach(() => {
    localStorage.removeItem('empower-educator-desk');
    useEducatorStore.setState({
      notes: useEducatorStore.getState().notes.filter((note) => note.sample),
      variations: useEducatorStore.getState().variations.filter((item) => item.sample),
      submissions: useEducatorStore.getState().submissions.map((item) =>
        item.sample && item.id !== 'sample-sub-faith'
          ? { ...item, status: 'pending', score: undefined, feedback: undefined }
          : item
      ),
    });
  });

  it('ships a plumbing instructor-led sample note and variation', () => {
    const { notes, variations, submissions } = useEducatorStore.getState();
    expect(notes.some((note) => note.slug === 'plumbing-waste' && note.sample)).toBe(true);
    expect(variations.some((item) => item.method === 'instructor-led' && item.sample)).toBe(true);
    expect(submissions.filter((item) => item.status === 'pending').length).toBeGreaterThan(0);
  });

  it('stores a library note for a programme', () => {
    const note = useEducatorStore.getState().addNote({
      programmeId: 'welding-fabrication',
      programmeTitle: 'Welding & fabrication',
      title: 'Tack sequence',
      body: 'Tack opposite corners before a full run.',
      method: 'guided-practice',
      outcomes: ['Square a frame after tacks'],
      educatorEmail: 'trainer@poly.ac.ke',
      educatorName: 'Amina',
    });
    expect(useEducatorStore.getState().notes[0]?.id).toBe(note.id);
    expect(note.programmeId).toBe('welding-fabrication');
  });

  it('grades a pending assignment', () => {
    useEducatorStore.getState().gradeSubmission('sample-sub-brian', {
      status: 'returned',
      score: 40,
      feedback: 'Need a seal photo and a clean potable rag.',
      gradedBy: 'Amina',
    });
    const row = useEducatorStore.getState().submissions.find((item) => item.id === 'sample-sub-brian');
    expect(row?.status).toBe('returned');
    expect(row?.feedback).toContain('seal photo');
  });
});
