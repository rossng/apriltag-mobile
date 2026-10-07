import { test, tagGrid } from './support/test';

test('detects tags in an uploaded image', async ({ app, imageFile }) => {
  await app.open();

  await app.uploadImage(await imageFile(tagGrid([0, 1, 2])));
  await app.expectDetectedTags([0, 1, 2]);

  await app.closeImage();
});

test('warns about duplicate markers', async ({ app, imageFile }) => {
  await app.open();

  await app.uploadImage(await imageFile(tagGrid([5, 5, 6])));
  await app.expectDetectedTags([5, 5, 6]);
  await app.expectDuplicateWarning('Duplicate marker: 5');
});
