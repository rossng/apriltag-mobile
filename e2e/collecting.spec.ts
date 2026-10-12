import { test, tagGrid } from './support/test';

test('cannot change family while collecting or viewing results', async ({
  app,
  camera,
}) => {
  await app.open();
  await app.setMode('Collect');

  await app.startCollecting();
  await camera.show(tagGrid([1]));
  await app.expectDetectedTags([1]);
  await app.expectFamilySelectable(false);

  await app.stopCollecting();
  await app.expectCollectedTags(['1']);
  await app.expectFamilySelectable(false);

  await app.closeCollectedTags();
  await app.expectFamilySelectable(true);
});

test('cannot switch mode while collecting', async ({ app }) => {
  await app.open();
  await app.setMode('Collect');
  await app.startCollecting();
  await app.expectModeSwitchable(false);

  await app.stopCollecting();
  await app.closeCollectedTags();
  await app.expectModeSwitchable(true);
});

test('closing the results returns to live detection', async ({
  app,
  camera,
}) => {
  await app.open();
  await app.setMode('Collect');
  await app.startCollecting();
  await app.stopCollecting();
  await app.expectCollectedTags([]);

  await app.closeCollectedTags();
  await camera.show(tagGrid([6]));
  await app.expectDetectedTags([6]);
  await app.startCollecting();
});
