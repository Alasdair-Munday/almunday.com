/** Return an explicit later revision date; never infer revisions from a rebuild. */
export function revisionDate(published, lastModified) {
  if (!lastModified) return null;
  const first = new Date(published);
  const updated = new Date(lastModified);
  if (!Number.isFinite(first.getTime()) || !Number.isFinite(updated.getTime())) return null;
  return updated.toISOString().slice(0, 10) > first.toISOString().slice(0, 10) ? updated : null;
}
