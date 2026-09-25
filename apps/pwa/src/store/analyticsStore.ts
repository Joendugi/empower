import { persist } from 'zustand/middleware';
import { create } from 'zustand';

export type AnalyticsEventType = 'course_choose' | 'course_open' | 'lesson_start' | 'lesson_complete';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  pathId?: string;
  lessonId?: string;
  at: string;
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  record: (type: AnalyticsEventType, input?: { pathId?: string; lessonId?: string }) => void;
}

const MAX_EVENTS = 2000;

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      events: [],
      record: (type, input) =>
        set((state) => ({
          events: [
            ...state.events.slice(-(MAX_EVENTS - 1)),
            {
              id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
              type,
              pathId: input?.pathId,
              lessonId: input?.lessonId,
              at: new Date().toISOString(),
            },
          ],
        })),
    }),
    { name: 'empower-analytics' }
  )
);
