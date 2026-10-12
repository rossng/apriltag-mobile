import { test, expect } from './support/test';

test('can be installed as an app', async ({ app, page }) => {
  await app.open();
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  const manifestUrl = new URL(href!, page.url());
  const manifest = await (await page.request.get(manifestUrl.href)).json();
  expect(manifest).toMatchObject({
    name: 'AprilTag Detector',
    display: 'standalone',
  });
  for (const { src } of manifest.icons) {
    const icon = await page.request.get(new URL(src, manifestUrl).href);
    expect(icon.ok(), src).toBe(true);
  }
});

test('works offline once visited', async ({ app, page, context }) => {
  await app.open();
  // Wait until the service worker has cached the app and taken over.
  await page.waitForFunction(() => navigator.serviceWorker.controller);

  await context.setOffline(true);
  await app.reload();
  await app.viewExample();
  await app.expectFamily('tagStandard52h13');
});
