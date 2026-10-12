import type { Point } from './detector';

/** What gestures on the camera view do. Points are in CSS pixels. */
export interface GestureHandlers {
  /** Whether pinching and scrolling zoom. */
  zoomable(): boolean;
  /** Whether dragging and scrolling pan. */
  pannable(): boolean;
  zoom(factor: number, at: Point): void;
  pan(dx: number, dy: number): void;
  /** Zooms in on a point, or back out (double-tap or double-click). */
  toggleZoom(at: Point): void;
  /** The mouse moving over a point, or a tap on it; null when the mouse leaves. */
  point(at: Point | null): void;
  /** A sideways swipe, when not panning. */
  swipe(direction: 'left' | 'right'): void;
}

/** How far a tap may wander, in CSS pixels. */
const TAP_SLOP = 8;
const DOUBLE_TAP_MS = 300;
/** The most one wheel event may zoom by, so mouse wheels don't jump. */
const MAX_WHEEL_ZOOM = 1.35;

/** Safari's trackpad pinch events, which TypeScript doesn't know about. */
interface GestureEvent extends UIEvent {
  scale: number;
  clientX: number;
  clientY: number;
}

/**
 * Interprets touches, mice, trackpads and wheels on an element:
 *
 * - Pinch, or Ctrl/⌘-scroll, to zoom. Trackpad pinches arrive as Ctrl-scroll
 *   in Chrome and Firefox, and as gesture events in Safari.
 * - Drag, or scroll, to pan.
 * - Double-tap or double-click to zoom in or back out.
 * - Tap, or hover with a mouse, to point at something.
 * - Swipe sideways when there's nothing to pan.
 */
export function attachGestures(
  element: HTMLElement,
  handlers: GestureHandlers
): () => void {
  const local = (e: { clientX: number; clientY: number }): Point => {
    const box = element.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };
  const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
  const midpoint = (a: Point, b: Point) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const pointers = new Map<number, Point>();
  let start: Point | undefined;
  let moved = false;
  let lastTap: { at: Point; time: number } | undefined;
  let safariPinch: number | undefined;

  function onPointerDown(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    element.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, local(e));
    // A second finger makes this a pinch, not a tap or swipe.
    if (pointers.size === 1) start = local(e);
    moved = pointers.size > 1;
  }

  function onPointerMove(e: PointerEvent) {
    const at = local(e);
    const previous = pointers.get(e.pointerId);
    if (!previous) {
      if (e.pointerType === 'mouse') handlers.point(at);
      return;
    }
    if (start && distance(at, start) > TAP_SLOP) moved = true;

    if (pointers.size === 2) {
      const [a, b] = pointers.values();
      pointers.set(e.pointerId, at);
      const [a2, b2] = pointers.values();
      if (handlers.pannable()) {
        const [from, to] = [midpoint(a, b), midpoint(a2, b2)];
        handlers.pan(to.x - from.x, to.y - from.y);
      }
      if (handlers.zoomable()) {
        handlers.zoom(distance(a2, b2) / distance(a, b), midpoint(a2, b2));
      }
      return;
    }

    pointers.set(e.pointerId, at);
    if (moved && handlers.pannable()) {
      handlers.pan(at.x - previous.x, at.y - previous.y);
    }
    if (e.pointerType === 'mouse') handlers.point(at);
  }

  function onPointerUp(e: PointerEvent) {
    if (!pointers.delete(e.pointerId) || pointers.size) return;
    const at = local(e);
    if (!moved && e.pointerType !== 'mouse') {
      const double =
        lastTap &&
        e.timeStamp - lastTap.time < DOUBLE_TAP_MS &&
        distance(at, lastTap.at) < 30;
      if (double && handlers.zoomable()) {
        handlers.toggleZoom(at);
        lastTap = undefined;
      } else {
        handlers.point(at);
        lastTap = { at, time: e.timeStamp };
      }
    } else if (moved && start && !handlers.pannable()) {
      const dx = at.x - start.x;
      const dy = at.y - start.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > 2 * Math.abs(dy)) {
        handlers.swipe(dx < 0 ? 'left' : 'right');
      }
    }
    start = undefined;
  }

  function onPointerCancel(e: PointerEvent) {
    pointers.delete(e.pointerId);
    start = undefined;
  }

  function onPointerLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse' && !pointers.size) handlers.point(null);
  }

  function onDoubleClick(e: MouseEvent) {
    if (handlers.zoomable()) handlers.toggleZoom(local(e));
  }

  function onWheel(e: WheelEvent) {
    const zooming = e.ctrlKey || e.metaKey;
    if (zooming ? !handlers.zoomable() : !handlers.pannable()) return;
    e.preventDefault();
    const unit =
      e.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : e.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? element.clientHeight
          : 1;
    if (!zooming) {
      handlers.pan(-e.deltaX * unit, -e.deltaY * unit);
    } else if (safariPinch === undefined) {
      const log = Math.log(MAX_WHEEL_ZOOM);
      const step = Math.min(Math.max(-e.deltaY * unit * 0.01, -log), log);
      handlers.zoom(Math.exp(step), local(e));
    }
  }

  function onGestureStart(e: Event) {
    e.preventDefault();
    safariPinch = 1;
  }

  function onGestureChange(e: Event) {
    e.preventDefault();
    const { scale } = e as GestureEvent;
    // Touch screens pinch through pointer events instead.
    if (safariPinch !== undefined && !pointers.size && handlers.zoomable()) {
      handlers.zoom(scale / safariPinch, local(e as GestureEvent));
    }
    safariPinch = scale;
  }

  function onGestureEnd(e: Event) {
    e.preventDefault();
    safariPinch = undefined;
  }

  const listeners: [string, (e: never) => void, AddEventListenerOptions?][] = [
    ['pointerdown', onPointerDown],
    ['pointermove', onPointerMove],
    ['pointerup', onPointerUp],
    ['pointercancel', onPointerCancel],
    ['pointerleave', onPointerLeave],
    ['dblclick', onDoubleClick],
    ['wheel', onWheel, { passive: false }],
    ['gesturestart', onGestureStart],
    ['gesturechange', onGestureChange],
    ['gestureend', onGestureEnd],
  ];
  for (const [type, listener, options] of listeners) {
    element.addEventListener(type, listener as EventListener, options);
  }
  return () => {
    for (const [type, listener, options] of listeners) {
      element.removeEventListener(type, listener as EventListener, options);
    }
  };
}
