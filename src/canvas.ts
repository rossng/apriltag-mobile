import { findDuplicateIds, type Detection } from './detector';

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
 */
export function drawOverlay(
  canvas: HTMLCanvasElement,
  detections: Detection[],
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
    Math.max(12, Math.round(Math.min(shown.width, shown.height) * 0.03)) *
    scale;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const duplicates = new Set(findDuplicateIds(detections));
  for (const { id, center, corners } of detections) {
    const duplicate = duplicates.has(id);
    const outline = duplicate ? '#ff4444' : '#00ffff';

    ctx.shadowColor = ctx.strokeStyle = outline;
    ctx.shadowBlur = 10;
    ctx.lineWidth = Math.max(1, fontSize * 0.07);
    ctx.beginPath();
    for (const { x, y } of corners) ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = duplicate ? '#ff8800' : '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      corners[0].x,
      corners[0].y,
      Math.max(1.5, fontSize * 0.15),
      0,
      2 * Math.PI
    );
    ctx.fill();

    const label = String(id);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(1, fontSize * 0.14);
    ctx.strokeText(label, center.x, center.y);
    ctx.strokeStyle = outline;
    ctx.lineWidth = Math.max(1, fontSize * 0.07);
    ctx.strokeText(label, center.x, center.y);
    ctx.shadowColor = ctx.fillStyle = duplicate ? '#ff4444' : '#00ff80';
    ctx.shadowBlur = 5;
    ctx.fillText(label, center.x, center.y);
    ctx.shadowBlur = 0;
  }
}
