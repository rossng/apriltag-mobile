import { test, expect, tagGrid } from './support/test';

/** Reads the width and height from a PNG's header. */
function pngSize(png: Buffer) {
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

test('saves the tags in view as a list, one per detection', async ({
  app,
  camera,
}) => {
  await app.open();
  await camera.show(tagGrid([5, 2, 5]));
  await app.expectDetectedTags([2, 5, 5]);

  const file = await app.saveTagList();
  expect(file.name).toMatch(/^apriltags-tag36h11-.+\.txt$/);
  expect(file.content.toString()).toBe('2\n5\n5\n');
});

test('saves every collected tag without abbreviating ranges', async ({
  app,
  camera,
}) => {
  await app.open();
  await app.setMode('Collect');
  await app.startCollecting();
  await camera.show(tagGrid([0, 1, 2, 3]));
  await app.expectDetectedTags([0, 1, 2, 3]);
  await app.stopCollecting();
  await app.expectCollectedTags(['0-3']);

  const file = await app.saveCollectedTags();
  expect(file.name).toMatch(/^apriltags-tag36h11-collected-.+\.txt$/);
  expect(file.content.toString()).toBe('0\n1\n2\n3\n');
});

test('saves the live view as an image at camera resolution', async ({
  app,
  camera,
}) => {
  await app.open();
  await camera.show(tagGrid([4]));
  await app.expectDetectedTags([4]);

  const file = await app.saveImage();
  expect(file.name).toMatch(/^apriltags-tag36h11-.+\.png$/);
  expect(pngSize(file.content)).toEqual({ width: 1280, height: 720 });
});

test('saves an uploaded image at its own resolution', async ({
  app,
  imageFile,
}) => {
  await app.open();
  await app.uploadImage(
    await imageFile(tagGrid([1], { width: 800, height: 600 }))
  );
  await app.expectDetectedTags([1]);

  const file = await app.saveImage();
  expect(pngSize(file.content)).toEqual({ width: 800, height: 600 });
});
