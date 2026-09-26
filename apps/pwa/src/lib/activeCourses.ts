/** Hard cap on concurrently active programmes (all tracks). */
export const MAX_ACTIVE_COURSES = 2;

/** Keep unique ids, preferring the most recently appended when over the cap. */
export function trimActivePathIds(ids: string[]): string[] {
  const unique: string[] = [];
  for (const id of ids) {
    if (!unique.includes(id)) unique.push(id);
  }
  return unique.slice(-MAX_ACTIVE_COURSES);
}

export function canAddActivePath(chosenPathIds: string[], pathId: string): boolean {
  return chosenPathIds.includes(pathId) || chosenPathIds.length < MAX_ACTIVE_COURSES;
}
