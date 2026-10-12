import type { Detection } from './detector';

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

/**
 * Draws detections at the given image resolution, over `image` if given or
 * otherwise over a transparent background (for overlaying live video).
 * Tags whose IDs are in `duplicateIds` are highlighted.
 */
export function drawOverlay(
  canvas: HTMLCanvasElement,
  detections: Detection[],
  duplicateIds: number[],
  { width, height }: { width: number; height: number },
  image?: ImageData
): void {
  if (canvas.width !== width || canvas.height !== height) {
    Object.assign(canvas, { width, height });
  }
  const ctx = canvas.getContext('2d')!;
  if (image) ctx.putImageData(image, 0, 0);
  else ctx.clearRect(0, 0, width, height);

  // Keep labels a constant on-screen size whatever the image resolution:
  // work out how many image pixels one CSS pixel covers under object-fit.
  const shown = canvas.getBoundingClientRect();
  const fit =
    getComputedStyle(canvas).objectFit === 'cover' ? Math.min : Math.max;
  const scale = fit(width / shown.width, height / shown.height) || 1;
  const fontSize =
    Math.max(14, Math.round(Math.min(shown.width, shown.height) * 0.03)) *
    scale;
  ctx.font = `600 ${fontSize}px ui-monospace, Menlo, Consolas, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';

  const duplicates = new Set(duplicateIds);
  for (const { id, center, corners } of detections) {
    const style = duplicates.has(id) ? DUPLICATE : NORMAL;

    // Tinted, glowing outline.
    ctx.beginPath();
    for (const { x, y } of corners) ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = style.fill;
    ctx.fill();
    ctx.shadowColor = ctx.strokeStyle = style.color;
    ctx.shadowBlur = 12 * scale;
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Marks the tag's top-left corner to show its orientation.
    ctx.fillStyle = style.corner;
    ctx.beginPath();
    ctx.arc(corners[0].x, corners[0].y, 3.5 * scale, 0, 2 * Math.PI);
    ctx.fill();

    // ID badge.
    const label = String(id);
    const w = ctx.measureText(label).width + fontSize * 0.9;
    const h = fontSize * 1.5;
    ctx.beginPath();
    ctx.roundRect(center.x - w / 2, center.y - h / 2, w, h, h / 2);
    ctx.fillStyle = 'rgba(6, 6, 12, 0.85)';
    ctx.fill();
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
    ctx.fillStyle = style.color;
    ctx.fillText(label, center.x, center.y + fontSize * 0.05);
  }
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
