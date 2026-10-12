// Lists of tag IDs, as people write them: 3, 7-9.

/** Summarises sorted, unique IDs, collapsing runs of three or more: 1-3, 5, 6. */
export function idRanges(ids: number[]): string[] {
  const entries: string[] = [];
  for (let start = 0; start < ids.length;) {
    let end = start;
    while (ids[end + 1] === ids[end] + 1) end++;
    if (end - start >= 2) entries.push(`${ids[start]}-${ids[end]}`);
    else for (let i = start; i <= end; i++) entries.push(String(ids[i]));
    start = end + 1;
  }
  return entries;
}

/**
 * Parses IDs and ranges of IDs, such as "3, 7-9". Skips entries that aren't
 * IDs in a family of `familySize` tags, and says whether there were any.
 */
export function parseIdRanges(
  text: string,
  familySize: number
): { ranges: [number, number][]; invalid: boolean } {
  const ranges: [number, number][] = [];
  let invalid = false;
  for (const entry of text.replace(/\s*-\s*/g, '-').split(/[\s,]+/)) {
    if (!entry) continue;
    const match = /^(\d+)(?:-(\d+))?$/.exec(entry);
    const first = Number(match?.[1]);
    const last = Number(match?.[2] ?? first);
    if (match && first <= last && last < familySize) ranges.push([first, last]);
    else invalid = true;
  }
  return { ranges, invalid };
}
