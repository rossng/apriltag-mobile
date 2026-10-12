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
  const github = about.getByRole('link', { name: /^GitHub/ });
  await expect(github).toHaveAttribute(
    'href',
    'https://github.com/rossng/apriltag-mobile'
  );
  // Opens in a new tab, so a scan in progress isn't lost.
  await expect(github).toHaveAttribute('target', '_blank');
  await expect(github).toHaveAccessibleName('GitHub (opens in a new tab)');

  await page.keyboard.press('Escape');
  await expect(about).toBeHidden();
});
