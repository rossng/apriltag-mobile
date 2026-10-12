import { test, expect } from './support/test';

test('the about panel describes the app and links to its source', async ({
  app,
  page,
}) => {
  await app.open();
  const about = await app.openAbout();
  await expect(
    about.getByRole('heading', { name: 'Online AprilTag detector' })
  ).toBeVisible();
  await expect(about.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/rossng/apriltag-mobile'
  );

  await page.keyboard.press('Escape');
  await expect(about).toBeHidden();
});
