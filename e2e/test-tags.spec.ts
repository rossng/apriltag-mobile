import { expect, test } from './support/test';

const FAMILIES = [
  'tag36h11',
  'tag25h9',
  'tag16h5',
  'tagStandard41h12',
  'tagStandard52h13',
  'tagCircle21h7',
  'tagCircle49h12',
  'tagCustom48h12',
];

for (const family of FAMILIES) {
  test(`the app detects the ${family} tags it shows`, async ({
    app,
    testTags,
  }) => {
    await testTags.open({ family, size: 100, ids: '0-5' });
    await testTags.hideControls();
    const image = await testTags.screenshot();

    await app.open();
    await app.selectFamily(family);
    await app.uploadImage(image);
    await app.expectDetectedTags([0, 1, 2, 3, 4, 5]);
  });
}

test('shows the tags in its URL and keeps changes there', async ({
  testTags,
}) => {
  await testTags.open({ family: 'tag25h9', size: 80, ids: '3, 0-2, 3' });
  await testTags.expectShownIds([3, 0, 1, 2, 3]);
  expect(await testTags.family()).toBe('tag25h9');
  expect(await testTags.size()).toBe(80);

  await testTags.setIds('7-9');
  await testTags.reload();
  await testTags.expectShownIds([7, 8, 9]);
  expect(await testTags.family()).toBe('tag25h9');
});

test('fills the screen with random tags when given no IDs', async ({
  testTags,
}) => {
  await testTags.open();
  const ids = await testTags.shownIds();
  expect(ids.length).toBeGreaterThan(0);
  expect(new Set(ids).size).toBe(ids.length);
  for (const id of ids) expect(id).toBeLessThan(587);
});

test('randomises each setting', async ({ testTags }) => {
  await testTags.open({ family: 'tag36h11', ids: '0-3' });

  await testTags.randomise('family');
  expect(await testTags.family()).not.toBe('tag36h11');

  await testTags.randomise('size');
  expect(await testTags.size()).toBeGreaterThanOrEqual(40);

  await testTags.randomise('IDs');
  const ids = await testTags.shownIds();
  expect(ids).not.toEqual([0, 1, 2, 3]);
  expect(new Set(ids).size).toBe(ids.length);
});

test('shows tags a family has when it lacks the IDs', async ({ testTags }) => {
  await testTags.open({ family: 'tag36h11', ids: '500-503' });
  await testTags.selectFamily('tag16h5');
  const ids = await testTags.shownIds();
  expect(ids.length).toBeGreaterThan(0);
  for (const id of ids) expect(id).toBeLessThan(30);
});

test('hides its controls until the tags are clicked', async ({ testTags }) => {
  await testTags.open({ ids: '0' });
  await testTags.hideControls();
  await testTags.showControls();
});
