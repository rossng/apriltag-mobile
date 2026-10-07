import { test as base } from '@playwright/test';
import { AprilTagApp, type ImageFile } from './app-driver';
import { installBrowserHarness } from './browser-harness';
import { loadTagImages, type Scene } from './scene';

export { expect } from '@playwright/test';
export { tagGrid } from './scene';

const tagImages = loadTagImages();

interface Fixtures {
  app: AprilTagApp;
  camera: FakeCamera;
  /** Renders a scene to a PNG file suitable for uploading. */
  imageFile: (scene: Scene, name?: string) => Promise<ImageFile>;
}

export interface FakeCamera {
  /** Points the fake camera at a scene. Only valid once the app is open. */
  show(scene: Scene): Promise<void>;
}

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.addInitScript(installBrowserHarness, {
      tagImages,
      camera: { width: 1280, height: 720, fps: 15 },
    });
    await use(page);
  },

  app: async ({ page }, use) => {
    await use(new AprilTagApp(page));
  },

  camera: async ({ page }, use) => {
    await use({
      show: (scene) => page.evaluate((s) => window.__e2e.camera.show(s), scene),
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
