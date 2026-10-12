import { test, tagGrid } from './support/test';

// Tags this small are only found at high resolution.
const smallTags = tagGrid(
  Array.from({ length: 200 }, (_, i) => i),
  { cols: 20, size: 12 }
);
const allSmallTags = smallTags.tags.map((t) => t.id);

test('high resolution finds smaller tags', async ({ app, camera }) => {
  await app.open();
  await camera.show(smallTags);
  await app.expectDetectedTags([]);

  await app.setHighResolution(true);
  await app.expectDetectedTags(allSmallTags);

  await app.reload();
  await camera.show(smallTags);
  await app.expectDetectedTags(allSmallTags);

  await app.setHighResolution(false);
  await app.expectDetectedTags([]);
});
