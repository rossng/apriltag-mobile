import type { Detection, Point } from './detector';

const scratch = document
  .createElement('canvas')
  .getContext('2d', { willReadFrequently: true })!;

/** Reads the pixels of a video frame or image. */
export function pixels(
  source: CanvasImageSource,
  width: number,
  height: number
): ImageData {
  scratch.canvas.width = width;
  scratch.canvas.height = height;
  scratch.drawImage(source, 0, 0);
  return scratch.getImageData(0, 0, width, height);
}

/** How tag IDs are sized: fitted to each tag, or a fixed on-screen size. */
export type LabelSize = 'auto' | 'small' | 'medium' | 'large';

export const LABEL_SIZES: Record<LabelSize, string> = {
  auto: 'Auto',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

/** Font sizes in CSS pixels. */
const FIXED_FONT = { small: 11, medium: 15, large: 21 };
const AUTO_FONT = { min: 10, max: 28 };
const FOCUSED_FONT = 18;

/** A badge's size relative to its font size. */
const BADGE_PADDING = 0.9;
const BADGE_HEIGHT = 1.5;

export interface OverlayOptions {
  /** Drawn behind the detections; otherwise the canvas is transparent. */
  image?: ImageData;
  /** IDs to highlight as duplicates. */
  duplicateIds: number[];
  labelSize: LabelSize;
  /** A point, in image pixels, whose tag's ID is brought to the front. */
  focus?: Point | null;
}

/** Draws detections over a canvas at the given image resolution. */
export function drawOverlay(
  canvas: HTMLCanvasElement,
  detections: Detection[],
  { width, height }: { width: number; height: number },
  { image, duplicateIds, labelSize, focus }: OverlayOptions
): void {
  if (canvas.width !== width || canvas.height !== height) {
    Object.assign(canvas, { width, height });
  }
  const ctx = canvas.getContext('2d')!;
  if (image) ctx.putImageData(image, 0, 0);
  else ctx.clearRect(0, 0, width, height);

  // Work in CSS pixels so outlines and labels look the same whatever the
  // image resolution.
  const scale = imagePixelsPerCssPixel(canvas);
  const duplicates = new Set(duplicateIds);
  const tags = detections.map((detection) => ({
    detection,
    style: duplicates.has(detection.id) ? DUPLICATE : NORMAL,
    badge: badge(ctx, detection, labelSize, scale),
  }));

  for (const { detection, style } of tags) {
    drawOutline(ctx, detection, style, scale);
  }

  // Labels go above every outline, with the focused one on top of the rest.
  const focused = focus ? tagAt(tags, focus) : undefined;
  for (const tag of tags) {
    if (tag !== focused) drawBadge(ctx, tag.badge, tag.style, scale);
  }
  if (focused) {
    const { detection, style } = focused;
    const fontSize = Math.max(focused.badge.fontSize, FOCUSED_FONT * scale);
    drawOutline(ctx, detection, style, scale, 3);
    drawBadge(ctx, badge(ctx, detection, fontSize, scale), style, scale, true);
  }
}

/**
 * Captures the overlay as a PNG, at full image resolution. A live overlay is
 * transparent, so the current video frame is drawn underneath it.
 */
export function snapshot(
  canvas: HTMLCanvasElement,
  video?: HTMLVideoElement
): Promise<Blob> {
  const out = document.createElement('canvas');
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext('2d')!;
  if (video) ctx.drawImage(video, 0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  return new Promise((resolve, reject) =>
    out.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Snapshot failed'))),
      'image/png'
    )
  );
}

/** Converts a position on screen to image pixels on the canvas. */
export function toImagePoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): Point {
  const box = canvas.getBoundingClientRect();
  const scale = imagePixelsPerCssPixel(canvas);
  // object-fit centres the image in the element.
  return {
    x: (clientX - box.left - box.width / 2) * scale + canvas.width / 2,
    y: (clientY - box.top - box.height / 2) * scale + canvas.height / 2,
  };
}

/** How many image pixels one CSS pixel covers, under the canvas's object-fit. */
function imagePixelsPerCssPixel(canvas: HTMLCanvasElement): number {
  const box = canvas.getBoundingClientRect();
  const fit =
    getComputedStyle(canvas).objectFit === 'cover' ? Math.min : Math.max;
  return fit(canvas.width / box.width, canvas.height / box.height) || 1;
}

type Style = typeof NORMAL;

interface Badge {
  text: string;
  center: Point;
  fontSize: number;
  width: number;
  height: number;
}

function font(size: number): string {
  return `600 ${size}px ui-monospace, Menlo, Consolas, monospace`;
}

/**
 * Lays out a tag's ID badge. Automatic sizing fits the badge inside the tag,
 * so long IDs on small tags don't spill onto their neighbours, within limits
 * that keep it legible and not too large.
 */
function badge(
  ctx: CanvasRenderingContext2D,
  { id, center, corners }: Detection,
  size: LabelSize | number,
  scale: number
): Badge {
  const text = String(id);
  ctx.font = font(100);
  const textWidth = ctx.measureText(text).width / 100;

  let fontSize: number;
  if (typeof size === 'number') {
    fontSize = size;
  } else if (size === 'auto') {
    const room = 2 * inradius(center, corners) * 0.85;
    const fitted = room / Math.max(textWidth + BADGE_PADDING, BADGE_HEIGHT);
    fontSize = Math.min(
      Math.max(fitted, AUTO_FONT.min * scale),
      AUTO_FONT.max * scale
    );
  } else {
    fontSize = FIXED_FONT[size] * scale;
  }

  return {
    text,
    center,
    fontSize,
    width: (textWidth + BADGE_PADDING) * fontSize,
    height: BADGE_HEIGHT * fontSize,
  };
}

/** The distance from a tag's centre to its nearest edge. */
function inradius(center: Point, corners: Point[]): number {
  return Math.min(
    ...corners.map((a, i) => {
      const b = corners[(i + 1) % corners.length];
      const length = Math.hypot(b.x - a.x, b.y - a.y);
      const cross =
        (b.x - a.x) * (center.y - a.y) - (b.y - a.y) * (center.x - a.x);
      return length ? Math.abs(cross) / length : 0;
    })
  );
}

/** The tag whose outline or badge contains a point, nearest first. */
function tagAt<T extends { detection: Detection; badge: Badge }>(
  tags: T[],
  point: Point
): T | undefined {
  const hits = tags.filter(
    ({ detection, badge }) =>
      contains(detection.corners, point) ||
      (Math.abs(point.x - badge.center.x) <= badge.width / 2 &&
        Math.abs(point.y - badge.center.y) <= badge.height / 2)
  );
  const distance = ({ detection: { center } }: T) =>
    Math.hypot(center.x - point.x, center.y - point.y);
  return hits.sort((a, b) => distance(a) - distance(b))[0];
}

/** Whether a convex polygon contains a point. */
function contains(polygon: Point[], { x, y }: Point): boolean {
  let sign = 0;
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    const cross = Math.sign((b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x));
    if (cross && sign && cross !== sign) return false;
    sign ||= cross;
  }
  return true;
}

function drawOutline(
  ctx: CanvasRenderingContext2D,
  { corners }: Detection,
  style: Style,
  scale: number,
  lineWidth = 2
): void {
  // Tinted, glowing outline.
  ctx.beginPath();
  for (const { x, y } of corners) ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fillStyle = style.fill;
  ctx.fill();
  ctx.shadowColor = ctx.strokeStyle = style.color;
  ctx.shadowBlur = 12 * scale;
  ctx.lineWidth = lineWidth * scale;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Marks the tag's top-left corner to show its orientation.
  ctx.fillStyle = style.corner;
  ctx.beginPath();
  ctx.arc(corners[0].x, corners[0].y, 3.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
}

function drawBadge(
  ctx: CanvasRenderingContext2D,
  { text, center, fontSize, width, height }: Badge,
  style: Style,
  scale: number,
  focused = false
): void {
  ctx.beginPath();
  ctx.roundRect(
    center.x - width / 2,
    center.y - height / 2,
    width,
    height,
    height / 2
  );
  if (focused) {
    ctx.shadowColor = style.color;
    ctx.shadowBlur = 16 * scale;
  }
  ctx.fillStyle = focused ? style.color : 'rgba(6, 6, 12, 0.85)';
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = style.color;
  ctx.lineWidth = Math.min(1.5 * scale, fontSize * 0.1);
  ctx.stroke();

  ctx.font = font(fontSize);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = focused ? '#06060c' : style.color;
  ctx.fillText(text, center.x, center.y + fontSize * 0.05);
}

const NORMAL = {
  color: '#2ef2ff',
  fill: 'rgba(46, 242, 255, 0.08)',
  corner: '#ff3fd8',
};
const DUPLICATE = {
  color: '#ff4d6a',
  fill: 'rgba(255, 77, 106, 0.12)',
  corner: '#ffb547',
};
