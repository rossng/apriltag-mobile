import { test, tagGrid } from './support/test';

/** Tag 3 with two of its data bits misread. */
const damagedTag = () => {
  const scene = tagGrid([3]);
  scene.tags[0].flipped = [
    [3, 3],
    [5, 6],
  ];
  return scene;
};

test('error correction decides whether damaged tags are detected', async ({
  app,
  imageFile,
}) => {
  await app.open();
  await app.uploadImage(await imageFile(damagedTag()));
  await app.expectErrorCorrection(2);
  await app.expectDetectedTags([3]);

  await app.setErrorCorrection(1);
  await app.expectDetectedTags([]);

  await app.setErrorCorrection(3);
  await app.expectDetectedTags([3]);
});

test('error correction applies to every family and is remembered', async ({
  app,
}) => {
  await app.open();
  await app.setErrorCorrection(0);
  await app.selectFamily('tag25h9');
  await app.expectErrorCorrection(0);

  await app.reload();
  await app.expectErrorCorrection(0);
});

test('warns when correcting more bits than a family can safely', async ({
  app,
}) => {
  await app.open();
  await app.selectFamily('tag16h5');
  await app.setErrorCorrection(2);
  await app.expectErrorCorrectionWarning(false);

  await app.setErrorCorrection(3);
  await app.expectErrorCorrectionWarning(true);
});
