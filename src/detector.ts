import createModule from './apriltag/apriltag_wasm.js';

export interface Point {
  x: number;
  y: number;
}

export interface Detection {
  id: number;
  center: Point;
  /** Clockwise from the tag's top-left corner. */
  corners: Point[];
}

/** Supported tag families and how many tags each contains. */
export const FAMILIES: Record<string, number> = {
  tag36h11: 587,
  tag25h9: 35,
  tag16h5: 30,
  tagStandard41h12: 2115,
  tagStandard52h13: 48714,
  tagCircle21h7: 38,
  tagCircle49h12: 65535,
  tagCustom48h12: 42211,
};

/** How many misread bits the detector can be asked to correct. */
export const ERROR_CORRECTION_BITS = [0, 1, 2, 3];
export const DEFAULT_ERROR_CORRECTION = 2;

/**
 * The most misread bits a family can correct without risking the wrong ID:
 * under half its minimum Hamming distance, which ends its name (e.g. h11).
 */
export function safeErrorCorrection(family: string): number {
  const distance = Number(family.match(/h(\d+)$/)![1]);
  return Math.floor((distance - 1) / 2);
}

/** Numbers per detection in the results buffer; see wasm/apriltag_wasm.c. */
const STRIDE = 11;

const wasm = await createModule();

/** Detects tags, correcting up to `bits` misread bits in each. */
export function detect(
  image: ImageData,
  family: string,
  bits: number
): Detection[] {
  // Only reconfigures the detector when the family or bits change.
  const status = wasm.ccall(
    'atag_set_family',
    'number',
    ['string', 'number'],
    [family, bits]
  );
  if (status !== 0) throw new Error(`Unsupported: ${family}, ${bits} bits`);

  // Each call can grow WASM memory, which replaces the HEAP* views, so only
  // read them afterwards.
  const imagePtr = wasm._atag_image(image.width, image.height);
  wasm.HEAPU8.set(image.data, imagePtr);
  const count = wasm._atag_detect(image.width, image.height);
  const start = wasm._atag_results() / Float64Array.BYTES_PER_ELEMENT;
  const r = wasm.HEAPF64.subarray(start, start + count * STRIDE);

  return Array.from({ length: count }, (_, i) => {
    const at = (j: number) => r[i * STRIDE + j];
    return {
      id: at(0),
      center: { x: at(1), y: at(2) },
      corners: [0, 1, 2, 3].map((c) => ({
        x: at(3 + 2 * c),
        y: at(4 + 2 * c),
      })),
    };
  });
}

/** A tag's cells, row by row: 0 for black, 255 for white, 128 for none. */
export interface TagPattern {
  size: number;
  cells: Uint8Array;
}

/** Renders one tag of a family as cells, for showing what the family looks like. */
export function renderTag(family: string, id: number): TagPattern {
  const size = wasm.ccall(
    'atag_render',
    'number',
    ['string', 'number'],
    [family, id]
  );
  if (size < 0) throw new Error(`Unknown tag: ${family} #${id}`);
  // Same size again, so this returns the buffer without changing it.
  const ptr = wasm._atag_image(size, size);
  return { size, cells: wasm.HEAPU8.slice(ptr, ptr + size * size) };
}

/** IDs that appear more than once, in ascending order. */
export function findDuplicateIds(detections: Detection[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();
  for (const { id } of detections) (seen.has(id) ? duplicates : seen).add(id);
  return [...duplicates].sort((a, b) => a - b);
}
