import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Lesson, SkillPath } from '@cyberlearn/types';
import { getLesson, getLessonAsync, getSkillPaths } from '@/content';
import { useCurriculumStore } from '@/store/curriculumStore';

describe('Dynamic Curriculum System', () => {
  beforeEach(() => {
    useCurriculumStore.setState({
      paths: [],
      cloudPaths: [],
      lessons: {},
      drafts: [],
      syncStatus: 'idle',
      lastSyncedAt: null,
    });
    vi.restoreAllMocks();
  });

  it('serves built-in skill paths by default when cloud is empty', () => {
    const paths = getSkillPaths();
    expect(paths.length).toBeGreaterThan(0);
    expect(paths.some((p) => p.id === 'cybersecurity')).toBe(true);
    expect(paths.some((p) => p.id === 'tvet-ict-technician')).toBe(true);
  });

  it('prioritizes dynamic cloud paths when loaded', () => {
    const mockCloudPath: SkillPath = {
      id: 'cybersecurity',
      title: 'Cloud Dynamic Cybersecurity',
      titleSw: 'Usalama wa Mtandao wa Wingu',
      description: 'Updated dynamic path from YAML / API',
      track: 'cybersecurity',
      certificationTarget: 'CompTIA Security+ SY0-701',
      contentVersion: '2.0.0',
      nodes: [
        {
          id: 'cloud-node-1',
          title: 'Cloud Node 1',
          lessonIds: ['cloud-lesson-1'],
          prerequisites: [],
        },
      ],
    };

    useCurriculumStore.setState({ cloudPaths: [mockCloudPath] });

    const paths = getSkillPaths();
    const cyberPath = paths.find((p) => p.id === 'cybersecurity');
    expect(cyberPath).toBeDefined();
    expect(cyberPath?.title).toBe('Cloud Dynamic Cybersecurity');
    expect(cyberPath?.nodes[0]?.id).toBe('cloud-node-1');
  });

  it('resolves remote lessons asynchronously and caches them in the store', async () => {
    const mockRemoteLesson: Lesson = {
      id: 'dynamic-vuln-lab',
      courseId: 'cybersecurity',
      title: 'Dynamic Vulnerability Lab',
      estimatedMinutes: 10,
      exercises: [
        {
          id: 'ex-1',
          type: 'MULTIPLE_CHOICE',
          prompt: 'What is SSRF?',
          options: [{ id: 'a', text: 'Server-Side Request Forgery' }],
          xpReward: 50,
        },
      ],
    };

    // Spy on fetchLesson
    const fetchSpy = vi.spyOn(useCurriculumStore.getState(), 'fetchLesson').mockImplementation(async (id) => {
      if (id === 'dynamic-vuln-lab') {
        useCurriculumStore.setState((s) => ({
          lessons: { ...s.lessons, [id]: mockRemoteLesson },
        }));
        return mockRemoteLesson;
      }
      return null;
    });

    // Before fetching, getLesson returns undefined
    expect(getLesson('dynamic-vuln-lab')).toBeUndefined();

    // getLessonAsync fetches and resolves
    const resolved = await getLessonAsync('dynamic-vuln-lab');
    expect(resolved).toBeDefined();
    expect(resolved?.id).toBe('dynamic-vuln-lab');
    expect(resolved?.title).toBe('Dynamic Vulnerability Lab');

    // After fetching, synchronous getLesson finds it in store
    expect(getLesson('dynamic-vuln-lab')).toBeDefined();
    expect(getLesson('dynamic-vuln-lab')?.title).toBe('Dynamic Vulnerability Lab');
    expect(fetchSpy).toHaveBeenCalledWith('dynamic-vuln-lab');
  });
});
