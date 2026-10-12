import { createSignal } from 'solid-js';

interface Range {
  min: number;
  max: number;
}

// Zoom and torch come from the Image Capture spec, which TypeScript's DOM
// types don't include.
type Capabilities = MediaTrackCapabilities & { zoom?: Range; torch?: boolean };
type Settings = MediaTrackSettings & { zoom?: number; torch?: boolean };

/**
 * Controls a camera's own zoom and torch, where it has them (mostly phone
 * cameras). Zooming the camera, unlike zooming the picture, gives the
 * detector more pixels per tag.
 */
export function createCameraControls() {
  const [range, setRange] = createSignal<Range | null>(null);
  const [zoom, setZoom] = createSignal(1);
  /** Whether the torch is on, or null if there isn't one. */
  const [torch, setTorch] = createSignal<boolean | null>(null);
  let track: MediaStreamTrack | undefined;
  let applying = false;
  let queued: Record<string, unknown> | undefined;

  // Pinching asks for many changes a second, so only send the latest once
  // the camera has caught up.
  function apply(constraints: Record<string, unknown>) {
    queued = { ...queued, ...constraints };
    if (applying || !track) return;
    const next = queued;
    queued = undefined;
    applying = true;
    track
      .applyConstraints({ advanced: [next as MediaTrackConstraintSet] })
      .catch(() => {})
      .finally(() => {
        applying = false;
        if (queued) apply({});
      });
  }

  return {
    range,
    zoom,
    torch,

    /** Takes control of a camera's video track, or of none. */
    use(newTrack?: MediaStreamTrack) {
      track = newTrack;
      queued = undefined;
      const capabilities = (track?.getCapabilities?.() ?? {}) as Capabilities;
      const settings = (track?.getSettings() ?? {}) as Settings;
      const zoomRange = capabilities.zoom;
      setRange(
        zoomRange && zoomRange.max > zoomRange.min
          ? { min: zoomRange.min, max: zoomRange.max }
          : null
      );
      setZoom(settings.zoom ?? zoomRange?.min ?? 1);
      setTorch(capabilities.torch ? !!settings.torch : null);
    },

    zoomBy(factor: number) {
      const r = range();
      if (!r) return;
      const value = Math.min(Math.max(zoom() * factor, r.min), r.max);
      setZoom(value);
      apply({ zoom: value });
    },

    resetZoom() {
      const r = range();
      if (!r) return;
      setZoom(r.min);
      apply({ zoom: r.min });
    },

    toggleTorch() {
      const on = !torch();
      setTorch(on);
      apply({ torch: on });
    },
  };
}
