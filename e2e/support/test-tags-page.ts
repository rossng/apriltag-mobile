import { expect, type Page } from '@playwright/test';
import type { ImageFile } from './app-driver';

/**
 * Drives the hidden page of tags for testing the app with, through
 * accessible roles and names only, like AprilTagApp.
 */
export class TestTagsPage {
  constructor(readonly page: Page) {}

  /** Opens the page, with settings as they appear in its URL. */
  async open(
    settings: { family?: string; size?: number; ids?: string } = {}
  ): Promise<void> {
    const query = new URLSearchParams(
      Object.entries(settings).map(([key, value]) => [key, String(value)])
    );
    await this.page.goto(`./test-tags/?${query}`);
    await this.expectDrawn();
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.expectDrawn();
  }

  async selectFamily(family: string): Promise<void> {
    await this.familySelect().selectOption(family);
    await this.expectDrawn();
  }

  async setIds(ids: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'IDs' }).fill(ids);
    await this.expectDrawn();
  }

  async randomise(setting: 'family' | 'size' | 'IDs'): Promise<void> {
    await this.button(`Random ${setting}`).click();
    await this.expectDrawn();
  }

  async hideControls(): Promise<void> {
    await this.button('Hide Controls').click();
    await expect(this.familySelect()).toBeHidden();
  }

  /** Shows the controls again by clicking the tags. */
  async showControls(): Promise<void> {
    await this.page.getByRole('list', { name: 'Tags' }).click();
    await expect(this.familySelect()).toBeVisible();
  }

  async family(): Promise<string> {
    return this.familySelect().inputValue();
  }

  async size(): Promise<number> {
    return Number(
      await this.page.getByRole('slider', { name: 'Size' }).inputValue()
    );
  }

  /** The IDs of the tags shown, in order. */
  async shownIds(): Promise<number[]> {
    const names = await this.page
      .getByRole('list', { name: 'Tags' })
      .getByRole('img')
      .evaluateAll((tags) => tags.map((tag) => tag.getAttribute('aria-label')));
    return names.map((name) => Number(name!.replace('Tag ', '')));
  }

  async expectShownIds(ids: number[]): Promise<void> {
    await expect.poll(() => this.shownIds()).toEqual(ids);
  }

  /** Captures what's on screen, as a camera pointed at it would see it. */
  async screenshot(): Promise<ImageFile> {
    return {
      name: 'test-tags.png',
      mimeType: 'image/png',
      buffer: await this.page.screenshot(),
    };
  }

  /** Waits until every tag has been rendered. */
  private async expectDrawn(): Promise<void> {
    await expect(this.page.locator('[aria-busy="true"]')).toHaveCount(0);
  }

  private familySelect() {
    return this.page.getByRole('combobox', { name: 'Family' });
  }

  private button(name: string) {
    return this.page.getByRole('button', { name, exact: true });
  }
}
