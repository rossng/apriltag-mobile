import { test, tagGrid } from './support/test';

test('zooms into an image with the zoom buttons', async ({
  app,
  imageFile,
}) => {
  await app.open();
  await app.expectZoomControls(false);
  await app.uploadImage(await imageFile(tagGrid([0, 1, 2, 3])));
  await app.expectZoom('1×');

  await app.zoomIn();
  await app.expectZoom('1.5×');
  // Zooming only changes the view, not what's detected.
  await app.expectDetectedTags([0, 1, 2, 3]);

  await app.resetZoom();
  await app.expectZoom('1×');
});

test('double-clicking zooms in and back out', async ({ app, imageFile }) => {
  await app.open();
  await app.uploadImage(await imageFile(tagGrid([5])));
  await app.doubleClickPicture();
  await app.expectZoom('2.5×');
  await app.doubleClickPicture();
  await app.expectZoom('1×');
});

test('pinching a trackpad zooms', async ({ app, imageFile }, info) => {
  test.skip(!!info.project.use.hasTouch, 'trackpads are for desktops');
  await app.open();
  await app.uploadImage(await imageFile(tagGrid([5])));
  await app.trackpadPinch(-20);
  await app.expectZoom('1.2×');
});

test('pinching a touch screen zooms', async ({ app, imageFile }, info) => {
  test.skip(!info.project.use.hasTouch, 'needs a touch screen');
  await app.open();
  await app.uploadImage(await imageFile(tagGrid([5])));
  await app.touchPinch(20);
  await app.expectZoom('2×');
});

test('zooming resets for the next picture', async ({ app, imageFile }) => {
  await app.open();
  await app.uploadImage(await imageFile(tagGrid([5])));
  await app.zoomIn();
  await app.closeImage();
  await app.expectZoomControls(false);
  await app.pause();
  await app.expectZoom('1×');
});
