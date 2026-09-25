import { getSkillPaths } from '@/content';
import type { AnalyticsEvent } from '@/store/analyticsStore';

export function courseAnalytics(events: AnalyticsEvent[]) {
  const paths = getSkillPaths();
  const byId = new Map(
    paths.map((path) => [
      path.id,
      {
        path,
        chooses: 0,
        opens: 0,
        lessonStarts: 0,
        completions: 0,
      },
    ])
  );

  for (const event of events) {
    const pathId =
      event.pathId ??
      paths.find((path) => path.nodes.some((node) => node.lessonIds.includes(event.lessonId ?? '')))?.id;
    if (!pathId) continue;
    const row = byId.get(pathId);
    if (!row) continue;
    if (event.type === 'course_choose') row.chooses += 1;
    if (event.type === 'course_open') row.opens += 1;
    if (event.type === 'lesson_start') row.lessonStarts += 1;
    if (event.type === 'lesson_complete') row.completions += 1;
  }

  const rows = [...byId.values()]
    .map((row) => ({
      ...row,
      preference: row.chooses * 3 + row.opens * 2 + row.lessonStarts + row.completions * 2,
    }))
    .filter((row) => row.preference > 0)
    .sort((a, b) => b.preference - a.preference);

  const tracks = {
    trades: 0,
    tvet: 0,
    cybersecurity: 0,
  };
  for (const row of rows) {
    const track = row.path.track ?? 'trades';
    tracks[track] += row.preference;
  }

  return {
    rows,
    tracks,
    totalEvents: events.length,
    preferred: rows[0],
  };
}
