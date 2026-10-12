import { test } from './support/test';

test('remembers the tag ID size across reloads', async ({ app }) => {
  await app.open();
  await app.expectTagIdSize('Auto');
  await app.setTagIdSize('Large');
  await app.reload();
  await app.expectTagIdSize('Large');
});
