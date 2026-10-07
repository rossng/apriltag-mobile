import { expect, type Page } from '@playwright/test';

export interface ImageFile {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

/**
 * Drives the app the way a user would. This is the only place that knows how
 * the UI is structured, and it relies solely on accessible roles/names plus
 * the `detected-tags` test ID — not on the UI framework or component
 * internals — so tests survive UI rewrites.
 */
export class AprilTagApp {
  constructor(readonly page: Page) {}

  /** Loads the app and waits until it is ready to detect. */
  async open(): Promise<void> {
    await this.page.goto('./');
    await expect(this.button('Pause')).toBeEnabled();
  }

  async pause(): Promise<void> {
    await this.button('Pause').click();
    await expect(this.button('Resume')).toBeVisible();
  }

  async resume(): Promise<void> {
    await this.button('Resume').click();
    await expect(this.button('Pause')).toBeVisible();
  }

  async startRecording(): Promise<void> {
    await this.button('Start recording').click();
    await expect(this.button('Stop recording')).toBeVisible();
  }

  async stopRecording(): Promise<void> {
    await this.button('Stop recording').click();
  }

  async closeImage(): Promise<void> {
    await this.button('Close image').click();
    await expect(this.button('Pause')).toBeVisible();
  }

  async setRecordMode(enabled: boolean): Promise<void> {
    await this.openMenu();
    const toggle = this.page.getByRole('menuitemcheckbox', {
      name: 'Record Mode',
    });
    if ((await toggle.getAttribute('aria-checked')) !== String(enabled)) {
      await toggle.click();
    }
    await expect(toggle).toBeChecked({ checked: enabled });
    await this.closeMenu();
  }

  async uploadImage(file: ImageFile): Promise<void> {
    const fileChooser = this.page.waitForEvent('filechooser');
    await this.openMenu();
    await this.page.getByRole('menuitem', { name: 'Select Image' }).click();
    await (await fileChooser).setFiles(file);
    await expect(this.button('Close image')).toBeVisible();
  }

  /**
   * Asserts the set of tags currently detected (order-insensitive).
   *
   * A matching reading can be transient — e.g. stale detections that have not
   * yet been replaced by the next frame — so once it matches, it must keep
   * matching for `stableForMs`.
   */
  async expectDetectedTags(
    ids: number[],
    { stableForMs = 500 }: { stableForMs?: number } = {}
  ): Promise<void> {
    const expected = [...ids].sort((a, b) => a - b).join(',');
    const readout = this.page.getByTestId('detected-tags');
    await expect(readout).toHaveAttribute('data-tag-ids', expected);

    const deadline = Date.now() + stableForMs;
    while (Date.now() < deadline) {
      await this.page.waitForTimeout(50);
      expect(
        await readout.getAttribute('data-tag-ids'),
        `detected tags changed within ${stableForMs}ms of matching`
      ).toBe(expected);
    }
  }

  async expectDuplicateWarning(text: string | RegExp): Promise<void> {
    await expect(this.page.getByRole('alert')).toHaveText(text);
  }

  /** Asserts the entries shown in the recorded-tags summary, e.g. `['0-7']`. */
  async expectRecordedTags(entries: string[]): Promise<void> {
    await expect(
      this.page
        .getByRole('list', { name: 'Recorded tags' })
        .getByRole('listitem')
    ).toHaveText(entries);
  }

  private button(name: string) {
    return this.page.getByRole('button', { name, exact: true });
  }

  private menuButton() {
    return this.page.getByRole('button', { name: 'More options' });
  }

  private async openMenu(): Promise<void> {
    const menuButton = this.menuButton();
    if ((await menuButton.getAttribute('aria-expanded')) !== 'true') {
      await menuButton.click();
    }
    await expect(this.page.getByRole('menu')).toBeVisible();
  }

  private async closeMenu(): Promise<void> {
    const menuButton = this.menuButton();
    if ((await menuButton.getAttribute('aria-expanded')) === 'true') {
      await menuButton.click();
    }
    await expect(this.page.getByRole('menu')).toBeHidden();
  }
}
