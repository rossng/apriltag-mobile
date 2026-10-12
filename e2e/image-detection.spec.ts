import { test, tagGrid } from './support/test';

test('detects tags in an uploaded image', async ({ app, imageFile }) => {
  await app.open();

  await app.uploadImage(await imageFile(tagGrid([0, 1, 2])));
  await app.expectDetectedTags([0, 1, 2]);

  await app.closeImage();
});

test('does not check for duplicate markers by default', async ({
  app,
  imageFile,
}) => {
  await app.open();
  await app.uploadImage(await imageFile(tagGrid([5, 5, 6])));
  await app.expectDetectedTags([5, 5, 6]);
  await app.expectDuplicateWarning(null);
});

test('warns about duplicate markers when enabled', async ({
  app,
  imageFile,
}) => {
  await app.open();
  await app.setDuplicateDetection(true);

  await app.uploadImage(await imageFile(tagGrid([5, 5, 6])));
  await app.expectDetectedTags([5, 5, 6]);
  await app.expectDuplicateWarning('Duplicate marker: 5');

  await app.closeImage();
  await app.expectDuplicateWarning(null);
});

test('remembers duplicate detection across reloads', async ({
  app,
  imageFile,
}) => {
  await app.open();
  await app.setDuplicateDetection(true);
  await app.reload();

  await app.uploadImage(await imageFile(tagGrid([2, 2])));
  await app.expectDuplicateWarning('Duplicate marker: 2');

  await app.setDuplicateDetection(false);
  await app.expectDuplicateWarning(null);
});
