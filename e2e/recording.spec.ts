import { test, tagGrid } from './support/test';

test('cannot change family while recording or viewing results', async ({
  app,
  camera,
}) => {
  await app.open();
  await app.setRecordMode(true);
  await camera.show(tagGrid([1]));

  await app.startRecording();
  await app.expectFamilySelectable(false);

  await app.stopRecording();
  await app.expectRecordedTags(['1']);
  await app.expectFamilySelectable(false);

  await app.closeRecordedTags();
  await app.expectFamilySelectable(true);
});

test('turning record mode off ends the recording', async ({ app, camera }) => {
  await app.open();
  await app.setRecordMode(true);
  await camera.show(tagGrid([2, 4, 5]));
  await app.startRecording();
  await app.expectDetectedTags([2, 4, 5]);

  await app.setRecordMode(false);
  await app.expectRecordedTags(['2', '4', '5']);
});

test('closing the results returns to live detection', async ({
  app,
  camera,
}) => {
  await app.open();
  await app.setRecordMode(true);
  await app.startRecording();
  await app.stopRecording();
  await app.expectRecordedTags([]);

  await app.closeRecordedTags();
  await camera.show(tagGrid([6]));
  await app.expectDetectedTags([6]);
  await app.startRecording();
});
