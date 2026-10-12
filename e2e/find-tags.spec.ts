import { test, tagGrid } from './support/test';

test('highlights the tags to find among those detected', async ({
  app,
  camera,
}) => {
  await app.open();
  await camera.show(tagGrid([1, 2, 3, 4]));
  await app.expectTagsToFind(null);

  await app.findTags('2, 4');
  await app.expectFoundTags([2, 4]);
  await app.expectDetectedTags([1, 2, 3, 4]);

  await app.stopFindingTags();
  await app.expectFoundTags([]);
  await app.expectDetectedTags([1, 2, 3, 4]);
});

test('remembers the tags to find across reloads', async ({ app, camera }) => {
  await app.open();
  await app.findTags('1-3');
  await app.reload();
  await app.expectTagsToFind('1-3');

  await camera.show(tagGrid([0, 1, 2, 3, 4]));
  await app.expectFoundTags([1, 2, 3]);
});

test('updates the highlights on a paused frame as the IDs change', async ({
  app,
  camera,
}) => {
  await app.open();
  await camera.show(tagGrid([1, 2, 3, 4, 5, 6]));
  await app.expectDetectedTags([1, 2, 3, 4, 5, 6]);
  await app.pause();
  await camera.show(tagGrid([7]));

  await app.findTags('1-3');
  await app.expectFoundTags([1, 2, 3]);
  await app.findTags('5');
  await app.expectFoundTags([5]);
  await app.expectDetectedTags([1, 2, 3, 4, 5, 6]);
});

test('changing family stops finding tags', async ({ app, camera }) => {
  await app.open();
  await camera.show(tagGrid([1]));
  await app.findTags('1');
  await app.expectFoundTags([1]);

  await app.selectFamily('tag25h9');
  await app.expectTagsToFind(null);
  await app.selectFamily('tag36h11');
  await app.expectTagsToFind(null);
  await app.expectFoundTags([]);
});

test('flags IDs that are not in the family', async ({ app, camera }) => {
  await app.open();
  await camera.show(tagGrid([1, 2]));

  await app.findTags('1, x, 9999');
  await app.expectTagsToFind('1, x, 9999', { invalid: true });
  await app.expectFoundTags([1]);
});

test('entering no IDs closes the search', async ({ app }) => {
  await app.open();
  await app.findTags('');
  await app.expectTagsToFind(null);
});

test('has a keyboard shortcut', async ({ app, camera, page }) => {
  await app.open();
  await camera.show(tagGrid([3, 4]));

  await app.pressShortcut('f');
  await app.expectFindTagsFocused();
  await page.keyboard.type('4');
  await app.expectTagsToFind('4');
  await app.expectFoundTags([4]);
});

test('typing IDs does not trigger zoom shortcuts', async ({ app, camera }) => {
  await app.open();
  await camera.show(tagGrid([1, 2]));
  await app.expectDetectedTags([1, 2]);
  await app.pause();
  await app.zoomIn();
  await app.expectZoom('1.5×');

  await app.findTags('0-2');
  await app.expectFoundTags([1, 2]);
  await app.expectZoom('1.5×');
});
