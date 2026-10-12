import { test, tagGrid } from './support/test';

test.describe('with two cameras', () => {
  test.use({ fakeCamera: { devices: 2, denied: false } });

  test('keeps detecting after switching camera', async ({ app, camera }) => {
    await app.open();
    await camera.show(tagGrid([1]));
    await app.expectDetectedTags([1]);

    await app.switchCamera();
    await app.switchCamera();
    await camera.show(tagGrid([2, 3]));
    await app.expectDetectedTags([2, 3]);
  });
});

test.describe('with camera access denied', () => {
  test.use({ fakeCamera: { devices: 1, denied: true } });

  test('explains the problem and still detects in images', async ({
    app,
    imageFile,
  }) => {
    await app.open({ camera: false });
    await app.expectStatus(/Camera access denied/);

    await app.uploadImage(await imageFile(tagGrid([6])));
    await app.expectDetectedTags([6]);
  });

  test('offers the example image instead', async ({ app }) => {
    await app.open({ camera: false });
    await app.viewExampleInstead();
    await app.expectFamily('tagStandard52h13');
  });
});
