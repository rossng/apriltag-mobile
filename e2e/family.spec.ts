import { test, tagGrid } from './support/test';

test('re-detects an uploaded image when the tag family changes', async ({
  app,
  imageFile,
}) => {
  await app.open();
  await app.uploadImage(await imageFile(tagGrid([0, 1, 2])));
  await app.expectDetectedTags([0, 1, 2]);

  await app.selectFamily('tag25h9');
  await app.expectDetectedTags([]);

  await app.selectFamily('tag36h11');
  await app.expectDetectedTags([0, 1, 2]);
});

test('re-detects a paused frame when the tag family changes', async ({
  app,
  camera,
}) => {
  await app.open();
  await camera.show(tagGrid([3, 4]));
  await app.expectDetectedTags([3, 4]);
  await app.pause();

  await app.selectFamily('tag25h9');
  await app.expectDetectedTags([]);

  await app.selectFamily('tag36h11');
  await app.expectDetectedTags([3, 4]);
});

test('live detection uses the newly selected family', async ({
  app,
  camera,
}) => {
  await app.open();
  await camera.show(tagGrid([7]));
  await app.expectDetectedTags([7]);

  await app.selectFamily('tag25h9');
  await app.expectDetectedTags([]);
});

test('remembers the selected family across reloads', async ({ app }) => {
  await app.open();
  await app.selectFamily('tagStandard41h12');
  await app.reload();
  await app.expectFamily('tagStandard41h12');
});

test('shows the example image with its tag family', async ({ app }) => {
  await app.open();
  await app.viewExample();
  await app.expectFamily('tagStandard52h13');
  await app.expectDetectedTags([
    1307, 1309, 1310, 1315, 1319, 1320, 1322, 1323, 1324, 1325, 1326, 1331,
    1332, 1337, 1361, 1407, 1411, 30207, 30208, 30209, 30210, 30212, 30213,
    30214, 30228, 30229, 30230, 30241,
  ]);
});
