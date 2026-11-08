/** What the front page lists: the newest n projects, and the newest n writings only when there are at least two. */
export function homeLists<P, W>(
  projects: P[],
  writings: W[],
  n = 3,
): { projects: P[]; writings: W[] | null } {
  return {
    projects: projects.slice(0, n),
    writings: writings.length >= 2 ? writings.slice(0, n) : null,
  };
}
