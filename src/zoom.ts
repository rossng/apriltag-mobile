import type { Point } from './detector';
import type { Size, View } from './canvas';

/**
 * A zoom applied on top of the view that fits an image to the screen: the
 * fitted image is scaled by `k`, then shifted by (x, y) CSS pixels.
 */
export interface Zoom {
  k: number;
  x: number;
  y: number;
}

export const NO_ZOOM: Zoom = { k: 1, x: 0, y: 0 };
export const MAX_ZOOM = 16;

/** Where an image appears on screen, in CSS pixels, once zoomed. */
export function zoomedView(fit: View, zoom: Zoom): View {
  return {
    scale: fit.scale * zoom.k,
    x: fit.x * zoom.k + zoom.x,
    y: fit.y * zoom.k + zoom.y,
  };
}

/** Where the image fits within the screen, for keeping it in view. */
export interface Bounds {
  fit: View;
  image: Size;
  box: Size;
}

/** Zooms by `factor`, keeping the point `at` (in CSS pixels) still. */
export function zoomBy(
  zoom: Zoom,
  factor: number,
  at: Point,
  bounds: Bounds
): Zoom {
  const k = Math.min(Math.max(zoom.k * factor, 1), MAX_ZOOM);
  const f = k / zoom.k;
  return keepInView(
    { k, x: at.x - (at.x - zoom.x) * f, y: at.y - (at.y - zoom.y) * f },
    bounds
  );
}

/** Moves the image by (dx, dy) CSS pixels. */
export function panBy(
  zoom: Zoom,
  dx: number,
  dy: number,
  bounds: Bounds
): Zoom {
  return keepInView({ ...zoom, x: zoom.x + dx, y: zoom.y + dy }, bounds);
}

/**
 * Stops the image being dragged away from the edges of the screen: it stays
 * covering the screen along an axis where it's big enough to, and centred
 * along one where it isn't.
 */
function keepInView(zoom: Zoom, { fit, image, box }: Bounds): Zoom {
  const axis = (
    shift: number,
    fitStart: number,
    length: number,
    room: number
  ) => {
    const start = fitStart * zoom.k + shift;
    const extent = length * fit.scale * zoom.k;
    const kept =
      extent <= room
        ? (room - extent) / 2
        : Math.min(0, Math.max(room - extent, start));
    return kept - fitStart * zoom.k;
  };
  return {
    k: zoom.k,
    x: axis(zoom.x, fit.x, image.width, box.width),
    y: axis(zoom.y, fit.y, image.height, box.height),
  };
}
