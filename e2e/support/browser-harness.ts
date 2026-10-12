import type { Scene } from './scene';

export interface HarnessOptions {
  /** Tag bitmaps as data URLs, keyed by `family:id`. */
  tagImages: Record<string, string>;
  /** The camera's resolution is what the app asks for, or else this size. */
  camera: FakeCameraOptions & { width: number; height: number; fps: number };
}

export interface FakeCameraOptions {
  /** How many camera devices to report. They all show the same scene. */
  devices: number;
  /** Rejects camera access as if the user denied permission. */
  denied: boolean;
  /** Reports a zoomable lens and a torch, as phone cameras often do. */
  phoneControls?: boolean;
}

/** The zoom and torch the app has set on the fake camera. */
export interface CameraSettings {
  zoom: number;
  torch: boolean;
}

export interface BrowserHarness {
  /** Renders a scene to a PNG data URL. */
  renderPng(scene: Scene): Promise<string>;
  camera: {
    /** Changes what the fake camera is pointing at. */
    show(scene: Scene): Promise<void>;
    settings(): CameraSettings;
  };
}

declare global {
  interface Window {
    __e2e: BrowserHarness;
  }
}

/**
 * Runs inside the page before any app code (via `page.addInitScript`), so it
 * must be self-contained: no imports or references to outer scope.
 *
 * Replaces the camera APIs with a fake camera backed by a canvas, and exposes
 * `window.__e2e` so tests can control what the camera sees. The app itself is
 * untouched — it sees an ordinary MediaStream.
 */
export function installBrowserHarness({ tagImages, camera }: HarnessOptions) {
  const imageCache = new Map<string, Promise<HTMLImageElement>>();

  function loadTag(key: string): Promise<HTMLImageElement> {
    let image = imageCache.get(key);
    if (!image) {
      const src = tagImages[key];
      if (!src) throw new Error(`No fixture image for tag ${key}`);
      image = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load tag ${key}`));
        img.src = src;
      });
      imageCache.set(key, image);
    }
    return image;
  }

  /** Inverts the given modules of a one-pixel-per-module tag bitmap. */
  function withFlips(
    image: HTMLImageElement,
    flipped: [number, number][] = []
  ): CanvasImageSource {
    if (!flipped.length) return image;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (const [x, y] of flipped) {
      const i = 4 * (y * canvas.width + x);
      for (let c = 0; c < 3; c++) pixels.data[i + c] = 255 - pixels.data[i + c];
    }
    ctx.putImageData(pixels, 0, 0);
    return canvas;
  }

  /** Renders a scene, scaled to `width` if that differs from the scene's. */
  async function renderScene(
    scene: Scene,
    width = scene.width
  ): Promise<HTMLCanvasElement> {
    const images = await Promise.all(
      scene.tags.map((t) => loadTag(`${t.family}:${t.id}`))
    );
    const scale = width / scene.width;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = Math.round(scene.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Tag bitmaps are one pixel per module; keep edges crisp when scaling up.
    ctx.imageSmoothingEnabled = false;
    scene.tags.forEach((t, i) =>
      ctx.drawImage(
        withFlips(images[i], t.flipped),
        t.x * scale,
        t.y * scale,
        t.size * scale,
        t.size * scale
      )
    );
    return canvas;
  }

  // The fake camera's output. captureStream() only emits a frame when the
  // canvas is drawn to, so repaint the current scene continuously.
  const cameraCanvas = document.createElement('canvas');
  cameraCanvas.width = camera.width;
  cameraCanvas.height = camera.height;
  const cameraCtx = cameraCanvas.getContext('2d')!;
  let currentScene: Scene | null = null;
  let currentFrame: HTMLCanvasElement | null = null;

  /** Renders the current scene at the camera's resolution. */
  async function renderFrame(): Promise<void> {
    const scene = currentScene;
    const frame = scene && (await renderScene(scene, cameraCanvas.width));
    if (scene === currentScene) currentFrame = frame;
  }

  setInterval(() => {
    const { width, height } = cameraCanvas;
    if (currentFrame) {
      cameraCtx.drawImage(currentFrame, 0, 0, width, height);
    } else {
      cameraCtx.fillStyle = '#ffffff';
      cameraCtx.fillRect(0, 0, width, height);
    }
  }, 1000 / camera.fps);

  const fakeDevices = Array.from(
    { length: camera.devices },
    (_, i) =>
      ({
        deviceId: `fake-camera-${i}`,
        groupId: `fake-camera-${i}`,
        kind: 'videoinput',
        label: `Fake camera ${i}`,
        toJSON() {
          return this;
        },
      }) as MediaDeviceInfo
  );

  navigator.mediaDevices.getUserMedia = async (constraints) => {
    if (camera.denied) {
      throw new DOMException('Permission denied', 'NotAllowedError');
    }
    if (!constraints?.video) {
      throw new DOMException(
        'Fake camera only provides video',
        'NotFoundError'
      );
    }
    // Real cameras pick their nearest resolution; this one gives exactly that.
    const ideal = (c?: ConstrainULong) => (typeof c === 'object' ? c.ideal : c);
    const video = constraints.video === true ? {} : constraints.video;
    const width = ideal(video.width) ?? camera.width;
    const height = ideal(video.height) ?? camera.height;
    if (width !== cameraCanvas.width || height !== cameraCanvas.height) {
      Object.assign(cameraCanvas, { width, height });
      currentFrame = null;
      await renderFrame();
    }

    const stream = cameraCanvas.captureStream(camera.fps);
    if (camera.phoneControls) {
      const track = stream.getVideoTracks()[0];
      const getSettings = track.getSettings.bind(track);
      track.getCapabilities = () =>
        ({ zoom: { min: 1, max: 8, step: 0.1 }, torch: true }) as never;
      track.getSettings = () => ({ ...getSettings(), ...cameraSettings });
      track.applyConstraints = async (constraints) => {
        for (const set of constraints?.advanced ?? []) {
          Object.assign(cameraSettings, set);
        }
      };
    }
    return stream;
  };
  navigator.mediaDevices.enumerateDevices = async () => fakeDevices;
  const cameraSettings = { zoom: 1, torch: false };

  window.__e2e = {
    async renderPng(scene) {
      return (await renderScene(scene)).toDataURL('image/png');
    },
    camera: {
      async show(scene) {
        currentScene = scene;
        await renderFrame();
      },
      settings: () => ({ ...cameraSettings }),
    },
  };
}
