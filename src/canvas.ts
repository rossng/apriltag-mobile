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

export interface Size {
  width: number;
  height: number;
}

/** Maps image pixels onto a canvas: canvas = image × scale + (x, y). */
export interface View {
  scale: number;
  x: number;
  y: number;
}

/** The view that fits an image into a box, as CSS object-fit does. */
export function fitView(image: Size, box: Size, cover: boolean): View {
  const fit = cover ? Math.max : Math.min;
  const scale = fit(box.width / image.width, box.height / image.height);
  return {
    scale,
    x: (box.width - image.width * scale) / 2,
    y: (box.height - image.height * scale) / 2,
  };
}

/** What to draw over an image. */
export interface Scene {
  detections: Detection[];
  /** IDs to highlight as duplicates. */
  duplicateIds: number[];
  labelSize: LabelSize;
  /** A point, in image pixels, whose tag's ID is brought to the front. */
  focus?: Point | null;
}

/**
 * Draws a scene, over `image` if given, placed on the canvas by `view`.
 * `cssPixel` is how many image pixels one CSS pixel covers on screen, which
 * keeps outlines and labels the same on-screen size at any zoom.
 */
export function drawScene(
  ctx: CanvasRenderingContext2D,
  { detections, duplicateIds, labelSize, focus }: Scene,
  view: View,
  cssPixel: number,
  image?: CanvasImageSource
): void {
  ctx.save();
  ctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
  if (image) {
    // Show pixels crisply once they're big enough to make out.
    ctx.imageSmoothingEnabled = view.scale < 2;
    ctx.drawImage(image, 0, 0);
  }

  // Shadows ignore the transform, so they're sized in canvas pixels.
  const sizes = { css: cssPixel, shadow: cssPixel * view.scale };
  const duplicates = new Set(duplicateIds);
  const tags = detections.map((detection) => ({
    detection,
    style: duplicates.has(detection.id) ? DUPLICATE : NORMAL,
    badge: badge(ctx, detection, labelSize, cssPixel),
  }));

  for (const { detection, style } of tags) {
    drawOutline(ctx, detection, style, sizes);
  }

  // Labels go above every outline, with the focused one on top of the rest.
  const focused = focus ? tagAt(tags, focus) : undefined;
  for (const tag of tags) {
    if (tag !== focused) drawBadge(ctx, tag.badge, tag.style, sizes);
  }
  if (focused) {
    const { detection, style } = focused;
    const fontSize = Math.max(focused.badge.fontSize, FOCUSED_FONT * cssPixel);
    drawOutline(ctx, detection, style, sizes, 3);
    drawBadge(
      ctx,
      badge(ctx, detection, fontSize, cssPixel),
      style,
      sizes,
      true
    );
  }
  ctx.restore();
}

/**
 * Captures an image with its scene drawn over it as a PNG, at the image's
 * full resolution, with labels sized as they appear on screen.
 */
export function snapshot(
  image: CanvasImageSource,
  { width, height }: Size,
  scene: Scene,
  cssPixel: number
): Promise<Blob> {
  const out = document.createElement('canvas');
  Object.assign(out, { width, height });
  drawScene(
    out.getContext('2d')!,
    scene,
    { scale: 1, x: 0, y: 0 },
    cssPixel,
    image
  );
  return new Promise((resolve, reject) =>
    out.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Snapshot failed'))),
      'image/png'
    )
  );
}

const drawable = new WeakMap<ImageData, HTMLCanvasElement>();

/** Image data as something that can be drawn scaled, which ImageData can't. */
export function drawableImage(image: ImageData): HTMLCanvasElement {
  let canvas = drawable.get(image);
  if (!canvas) {
    canvas = document.createElement('canvas');
    Object.assign(canvas, { width: image.width, height: image.height });
    canvas.getContext('2d')!.putImageData(image, 0, 0);
    drawable.set(image, canvas);
  }
  return canvas;
}

type Style = typeof NORMAL;

/** Image pixels per CSS pixel, and canvas pixels per CSS pixel for shadows. */
interface Sizes {
  css: number;
  shadow: number;
}

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
  sizes: Sizes,
  lineWidth = 2
): void {
  // Tinted, glowing outline.
  ctx.beginPath();
  for (const { x, y } of corners) ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fillStyle = style.fill;
  ctx.fill();
  ctx.shadowColor = ctx.strokeStyle = style.color;
  ctx.shadowBlur = 12 * sizes.shadow;
  ctx.lineWidth = lineWidth * sizes.css;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Marks the tag's top-left corner to show its orientation.
  ctx.fillStyle = style.corner;
  ctx.beginPath();
  ctx.arc(corners[0].x, corners[0].y, 3.5 * sizes.css, 0, 2 * Math.PI);
  ctx.fill();
}

function drawBadge(
  ctx: CanvasRenderingContext2D,
  { text, center, fontSize, width, height }: Badge,
  style: Style,
  sizes: Sizes,
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
    ctx.shadowBlur = 16 * sizes.shadow;
  }
  ctx.fillStyle = focused ? style.color : 'rgba(6, 6, 12, 0.85)';
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = style.color;
  ctx.lineWidth = Math.min(1.5 * sizes.css, fontSize * 0.1);
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
