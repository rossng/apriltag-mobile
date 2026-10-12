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

/** A tag's cells, row by row: 0 for black, 255 for white, 128 for none. */
export interface TagPattern {
  size: number;
  cells: Uint8Array;
}

export type DetectorRequest =
  | {
      kind: 'detect';
      image: ImageData;
      family: string;
      bits: number;
      quadDecimate: number;
    }
  | { kind: 'render'; family: string; tag: number };

/** Messages are numbered to match responses with their requests. */
export type DetectorMessage = DetectorRequest & { id: number };

export type DetectorResponse = { id: number } & (
  { result: Detection[] | TagPattern } | { error: string }
);

// The detector runs in a worker so that slow frames don't hold up the page.
// The worker handles one request at a time, in order.
const worker = new Worker(new URL('./detect-worker.ts', import.meta.url), {
  type: 'module',
});
const pending = new Map<number, (response: DetectorResponse) => void>();
let nextId = 0;

worker.onmessage = ({ data }: MessageEvent<DetectorResponse>) => {
  pending.get(data.id)?.(data);
  pending.delete(data.id);
};
worker.onerror = (event) => {
  for (const [id, settle] of pending) settle({ id, error: event.message });
  pending.clear();
};

function request<T>(
  message: DetectorRequest,
  transfer: Transferable[] = []
): Promise<T> {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, (response) =>
      'error' in response
        ? reject(new Error(response.error))
        : resolve(response.result as T)
    );
    const numbered: DetectorMessage = { ...message, id };
    worker.postMessage(numbered, transfer);
  });
}

export interface DetectOptions {
  family: string;
  /** How many misread bits to correct in each tag. */
  bits: number;
  /** Finds smaller tags, but takes longer. */
  highRes: boolean;
}

/**
 * Detects tags in an image. With `transfer`, the image's pixels move to the
 * worker rather than being copied, which leaves `image` empty.
 */
export function detect(
  image: ImageData,
  { family, bits, highRes }: DetectOptions,
  { transfer = false } = {}
): Promise<Detection[]> {
  return request(
    { kind: 'detect', image, family, bits, quadDecimate: highRes ? 1 : 2 },
    transfer ? [image.data.buffer] : []
  );
}

/** Renders one tag of a family as cells, for showing what the family looks like. */
export function renderTag(family: string, tag: number): Promise<TagPattern> {
  return request({ kind: 'render', family, tag });
}

/** IDs that appear more than once, in ascending order. */
export function findDuplicateIds(detections: Detection[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();
  for (const { id } of detections) (seen.has(id) ? duplicates : seen).add(id);
  return [...duplicates].sort((a, b) => a - b);
}
