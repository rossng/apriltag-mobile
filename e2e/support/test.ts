import { test as base } from '@playwright/test';
import { AprilTagApp, type ImageFile } from './app-driver';
import {
  installBrowserHarness,
  type CameraSettings,
  type FakeCameraOptions,
} from './browser-harness';
import { loadTagImages, type Scene } from './scene';

export { expect } from '@playwright/test';
export { tagGrid } from './scene';

const tagImages = loadTagImages();

interface Options {
  fakeCamera: FakeCameraOptions;
}

interface Fixtures {
  app: AprilTagApp;
  camera: FakeCamera;
  /** Renders a scene to a PNG file suitable for uploading. */
  imageFile: (scene: Scene, name?: string) => Promise<ImageFile>;
}

export interface FakeCamera {
  /** Points the fake camera at a scene. Only valid once the app is open. */
  show(scene: Scene): Promise<void>;
  /** The zoom and torch the app has set, with `phoneControls`. */
  settings(): Promise<CameraSettings>;
}

export const test = base.extend<Fixtures & Options>({
  fakeCamera: [{ devices: 1, denied: false }, { option: true }],

  page: async ({ page, fakeCamera }, use) => {
    await page.addInitScript(installBrowserHarness, {
      tagImages,
      camera: { width: 1280, height: 720, fps: 15, ...fakeCamera },
    });
    await use(page);
  },

  app: async ({ page }, use) => {
    await use(new AprilTagApp(page));
  },

  camera: async ({ page }, use) => {
    await use({
      show: (scene) => page.evaluate((s) => window.__e2e.camera.show(s), scene),
      settings: () => page.evaluate(() => window.__e2e.camera.settings()),
    });
  },

  imageFile: async ({ page }, use) => {
    await use(async (scene, name = 'scene.png') => {
      const dataUrl = await page.evaluate(
        (s) => window.__e2e.renderPng(s),
        scene
      );
      const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
      return {
        name,
        mimeType: 'image/png',
        buffer: Buffer.from(base64, 'base64'),
      };
    });
  },
});
