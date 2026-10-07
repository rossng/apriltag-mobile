import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * A synthetic image made of AprilTags on a white background. Scenes are plain
 * data so they can be passed into the browser, where they are rendered either
 * as fake camera frames or as image files to upload.
 */
export interface Scene {
  width: number;
  height: number;
  tags: TagPlacement[];
}

export interface TagPlacement {
  family: TagFamily;
  id: number;
  /** Top-left corner and edge length in pixels, including the tag's own white border. */
  x: number;
  y: number;
  size: number;
}

export type TagFamily = 'tag36h11';

const TAG_FILE_PATTERNS: Record<TagFamily, RegExp> = {
  tag36h11: /^tag36_11_(\d+)\.png$/,
};

const TAGS_DIR = join(import.meta.dirname, '..', 'fixtures', 'tags');

/**
 * Lays out the given tag IDs in a grid, each tag centred in its cell with a
 * generous quiet zone.
 */
export function tagGrid(
  ids: number[],
  {
    family = 'tag36h11',
    width = 1280,
    height = 720,
  }: { family?: TagFamily; width?: number; height?: number } = {}
): Scene {
  const cols = Math.min(ids.length, 4);
  const rows = Math.ceil(ids.length / cols);
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  const size = Math.floor(Math.min(cellWidth, cellHeight) * 0.7);

  const tags = ids.map((id, i) => ({
    family,
    id,
    x: Math.round((i % cols) * cellWidth + (cellWidth - size) / 2),
    y: Math.round(Math.floor(i / cols) * cellHeight + (cellHeight - size) / 2),
    size,
  }));

  return { width, height, tags };
}

/**
 * Loads every committed tag bitmap as a data URL, keyed by `family:id`, for
 * injection into the page.
 */
export function loadTagImages(): Record<string, string> {
  const images: Record<string, string> = {};
  for (const [family, pattern] of Object.entries(TAG_FILE_PATTERNS)) {
    const dir = join(TAGS_DIR, family);
    for (const file of readdirSync(dir)) {
      const match = pattern.exec(file);
      if (!match) continue;
      const png = readFileSync(join(dir, file)).toString('base64');
      images[`${family}:${Number(match[1])}`] = `data:image/png;base64,${png}`;
    }
  }
  return images;
}
