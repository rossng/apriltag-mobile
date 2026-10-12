import { test, tagGrid } from './support/test';

test('detects tags from the camera and freezes them when paused', async ({
  app,
  camera,
}) => {
  await app.open();

  await camera.show(tagGrid([1, 2]));
  await app.expectDetectedTags([1, 2]);

  await app.pause();
  await camera.show(tagGrid([3]));
  await app.expectDetectedTags([1, 2]);

  await app.resume();
  await app.expectDetectedTags([3]);
});

test('collect mode accumulates tags seen across frames', async ({
  app,
  camera,
}) => {
  await app.open();
  await app.setMode('Collect');

  // Show each scene only once collecting, so the readout can only match
  // after a frame has been collected.
  await app.startCollecting();
  await camera.show(tagGrid([0, 1, 2, 3]));
  await app.expectDetectedTags([0, 1, 2, 3]);

  await camera.show(tagGrid([4, 5, 6, 7]));
  await app.expectDetectedTags([4, 5, 6, 7]);

  await app.stopCollecting();
  await app.expectCollectedTags(['0-7']);
});

test('detects and finds tags among many in one frame', async ({
  app,
  camera,
}) => {
  const ids = Array.from({ length: 144 }, (_, i) => i);
  await app.open();
  await camera.show(tagGrid(ids, { cols: 16 }));
  await app.expectDetectedTags(ids);

  await app.findTags('7, 70, 140-143');
  await app.expectFoundTags([7, 70, 140, 141, 142, 143]);
});
