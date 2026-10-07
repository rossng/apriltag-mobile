import type { Scene } from './scene';

export interface HarnessOptions {
  /** Tag bitmaps as data URLs, keyed by `family:id`. */
  tagImages: Record<string, string>;
  camera: { width: number; height: number; fps: number };
}

export interface BrowserHarness {
  /** Renders a scene to a PNG data URL. */
  renderPng(scene: Scene): Promise<string>;
  camera: {
    /** Changes what the fake camera is pointing at. */
    show(scene: Scene): Promise<void>;
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

  async function renderScene(scene: Scene): Promise<HTMLCanvasElement> {
    const images = await Promise.all(
      scene.tags.map((t) => loadTag(`${t.family}:${t.id}`))
    );
    const canvas = document.createElement('canvas');
    canvas.width = scene.width;
    canvas.height = scene.height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Tag bitmaps are one pixel per module; keep edges crisp when scaling up.
    ctx.imageSmoothingEnabled = false;
    scene.tags.forEach((t, i) =>
      ctx.drawImage(images[i], t.x, t.y, t.size, t.size)
    );
    return canvas;
  }

  // The fake camera's output. captureStream() only emits a frame when the
  // canvas is drawn to, so repaint the current scene continuously.
  const cameraCanvas = document.createElement('canvas');
  cameraCanvas.width = camera.width;
  cameraCanvas.height = camera.height;
  const cameraCtx = cameraCanvas.getContext('2d')!;
  let currentFrame: HTMLCanvasElement | null = null;

  setInterval(() => {
    if (currentFrame) {
      cameraCtx.drawImage(currentFrame, 0, 0, camera.width, camera.height);
    } else {
      cameraCtx.fillStyle = '#ffffff';
      cameraCtx.fillRect(0, 0, camera.width, camera.height);
    }
  }, 1000 / camera.fps);

  const fakeDevice = {
    deviceId: 'fake-camera',
    groupId: 'fake-camera',
    kind: 'videoinput',
    label: 'Fake camera',
    toJSON() {
      return this;
    },
  } as MediaDeviceInfo;

  navigator.mediaDevices.getUserMedia = async (constraints) => {
    if (!constraints?.video) {
      throw new DOMException(
        'Fake camera only provides video',
        'NotFoundError'
      );
    }
    return cameraCanvas.captureStream(camera.fps);
  };
  navigator.mediaDevices.enumerateDevices = async () => [fakeDevice];

  window.__e2e = {
    async renderPng(scene) {
      return (await renderScene(scene)).toDataURL('image/png');
    },
    camera: {
      async show(scene) {
        currentFrame = await renderScene(scene);
      },
    },
  };
}
