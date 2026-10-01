import { beforeEach, describe, expect, it } from 'vitest';
import { useCampusHub } from '@/store/campusHub';

describe('campus hub', () => {
  beforeEach(() => {
    const state = useCampusHub.getState();
    useCampusHub.setState({
      campuses: state.campuses.filter((item) => item.id === 'campus-ntti'),
      classes: state.classes.filter((item) => item.id === 'class-plb-morning'),
      roster: state.roster.filter((item) => item.sample),
      materials: state.materials.filter((item) => item.classId === 'class-plb-morning'),
      exams: state.exams.filter((item) => item.id === 'exam-trap-cat'),
      attempts: [],
      results: state.results.filter((item) => item.id === 'res-faith'),
    });
  });

  it('lets a learner join a class with a code', () => {
    const room = useCampusHub.getState().joinClass('PLB501', {
      name: 'Joe Learner',
      email: 'joe@learner.ke',
    });
    expect(room?.title).toContain('Plumbing');
    expect(
      useCampusHub.getState().roster.some((item) => item.email === 'joe@learner.ke' && item.classId === room?.id)
    ).toBe(true);
  });

  it('autogrades a published exam into the results book', () => {
    const attempt = useCampusHub.getState().submitExam({
      examId: 'exam-trap-cat',
      classId: 'class-plb-morning',
      learnerEmail: 'amina.otieno@learner.ke',
      learnerName: 'Amina Otieno',
      answers: { q1: 'b', q2: 'b' },
    });
    expect(attempt.score).toBe(2);
    expect(attempt.max).toBe(2);
    const result = useCampusHub.getState().results.find((item) => item.learnerEmail === 'amina.otieno@learner.ke');
    expect(result?.title).toContain('CAT 1');
  });

  it('stores a video or link as class material', () => {
    const material = useCampusHub.getState().addMaterial({
      classId: 'class-plb-morning',
      kind: 'video',
      title: 'Workshop walk-through',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
    expect(material.kind).toBe('video');
    expect(useCampusHub.getState().materials[0]?.id).toBe(material.id);
  });
});
