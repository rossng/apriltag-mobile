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

test('record mode accumulates tags seen across frames', async ({
  app,
  camera,
}) => {
  await app.open();
  await app.setRecordMode(true);

  await camera.show(tagGrid([0, 1, 2, 3]));
  await app.startRecording();
  await app.expectDetectedTags([0, 1, 2, 3]);

  await camera.show(tagGrid([4, 5, 6, 7]));
  await app.expectDetectedTags([4, 5, 6, 7]);

  await app.stopRecording();
  await app.expectRecordedTags(['0-7']);
});
