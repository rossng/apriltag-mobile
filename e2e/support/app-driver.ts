import { readFile } from 'node:fs/promises';
import { expect, type Page } from '@playwright/test';

export interface ImageFile {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

/**
 * Drives the app the way a user would. This is the only place that knows how
 * the UI is structured, and it relies solely on accessible roles/names plus
 * the `detected-tags` and `picture` test IDs — not on the UI framework or component
 * internals — so tests survive UI rewrites.
 */
export interface SavedFile {
  name: string;
  content: Buffer;
}

export class AprilTagApp {
  constructor(readonly page: Page) {}

  /**
   * Loads the app and waits until it is ready to detect from the camera, or
   * with `camera: false`, just until it is usable (e.g. camera denied).
   */
  async open({ camera = true }: { camera?: boolean } = {}): Promise<void> {
    await this.page.goto('./');
    await expect(
      camera ? this.button('Pause') : this.menuButton()
    ).toBeEnabled();
  }

  async reload(): Promise<void> {
    await this.page.reload();
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

  async startCollecting(): Promise<void> {
    await this.button('Start collecting').click();
    await expect(this.button('Stop collecting')).toBeVisible();
  }

  async stopCollecting(): Promise<void> {
    await this.button('Stop collecting').click();
  }

  async closeCollectedTags(): Promise<void> {
    await this.button('Close collected tags').click();
    await expect(
      this.page.getByRole('list', { name: 'Collected tags' })
    ).toBeHidden();
  }

  async closeImage(): Promise<void> {
    await this.button('Close image').click();
    await expect(this.button('Pause')).toBeVisible();
  }

  async setMode(mode: 'Scan' | 'Collect'): Promise<void> {
    await this.mode(mode).check();
  }

  async expectModeSwitchable(switchable: boolean): Promise<void> {
    for (const mode of ['Scan', 'Collect'] as const) {
      await expect(this.mode(mode)).toBeEnabled({ enabled: switchable });
    }
  }

  async setDuplicateDetection(enabled: boolean): Promise<void> {
    await this.button('View options').click();
    await this.viewOptions()
      .getByRole('switch', { name: 'Highlight Duplicate IDs' })
      .setChecked(enabled);
    await this.page.keyboard.press('Escape');
    await expect(this.viewOptions()).toBeHidden();
  }

  async switchCamera(): Promise<void> {
    await this.openMenu();
    await this.page.getByRole('menuitem', { name: 'Switch Camera' }).click();
  }

  async viewExample(): Promise<void> {
    await this.openMenu();
    await this.page
      .getByRole('menuitem', { name: 'Try Example Image' })
      .click();
    await expect(this.button('Close example')).toBeVisible();
  }

  /** Uses the example offered when the camera is unavailable. */
  async viewExampleInstead(): Promise<void> {
    await this.button('Try Example Image').click();
    await expect(this.button('Close example')).toBeVisible();
  }

  async zoomIn(): Promise<void> {
    await this.button('Zoom in').click();
  }

  async resetZoom(): Promise<void> {
    await this.button('Reset zoom').click();
  }

  /** Asserts the zoom level shown, e.g. `1×` when not zoomed. */
  async expectZoom(level: string): Promise<void> {
    await expect(this.button('Reset zoom')).toHaveText(level);
  }

  async toggleTorch(): Promise<void> {
    await this.button('Torch').click();
  }

  async expectTorch(on: boolean): Promise<void> {
    await expect(this.button('Torch')).toHaveAttribute(
      'aria-pressed',
      String(on)
    );
  }

  async expectZoomControls(shown: boolean): Promise<void> {
    await expect(this.button('Zoom in')).toBeVisible({ visible: shown });
  }

  async doubleClickPicture(): Promise<void> {
    await this.picture().dblclick();
  }

  /** Pinches on a trackpad, which browsers report as Ctrl-scrolling. */
  async trackpadPinch(deltaY: number): Promise<void> {
    await this.page.mouse.move(...(await this.pictureCentre()));
    await this.page.keyboard.down('Control');
    await this.page.mouse.wheel(0, deltaY);
    await this.page.keyboard.up('Control');
  }

  /** Spreads two fingers apart on a touch screen by `spread` pixels each. */
  async touchPinch(spread: number): Promise<void> {
    const [x, y] = await this.pictureCentre();
    const cdp = await this.page.context().newCDPSession(this.page);
    const fingers = (d: number) => [
      { x: x - d, y, id: 0 },
      { x: x + d, y, id: 1 },
    ];
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: fingers(20),
    });
    for (let step = 1; step <= 5; step++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: fingers(20 + (spread * step) / 5),
      });
    }
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
  }

  private picture() {
    return this.page.getByTestId('picture');
  }

  private async pictureCentre(): Promise<[number, number]> {
    const box = (await this.picture().boundingBox())!;
    return [box.x + box.width / 2, box.y + box.height / 2];
  }

  async selectFamily(family: string): Promise<void> {
    await this.familySelect().click();
    await this.page
      .getByRole('option', { name: new RegExp(`^${family} `) })
      .click();
    await this.expectFamily(family);
  }

  /** Presses keys with the family picker focused. */
  async pressOnFamilyPicker(...keys: string[]): Promise<void> {
    await this.familySelect().focus();
    for (const key of keys) await this.page.keyboard.press(key);
  }

  async expectFamilyListOpen(open: boolean): Promise<void> {
    await expect(
      this.page.getByRole('listbox', { name: 'Tag family' })
    ).toBeVisible({ visible: open });
  }

  async expectFamily(family: string): Promise<void> {
    await expect(this.familySelect()).toContainText(`${family} `);
  }

  async expectFamilySelectable(selectable: boolean): Promise<void> {
    await expect(this.familySelect()).toBeEnabled({ enabled: selectable });
  }

  /** Opens the about panel and returns it. */
  async openAbout() {
    await this.openMenu();
    await this.page.getByRole('menuitem', { name: 'About' }).click();
    const about = this.page.locator('#about');
    await expect(about).toBeVisible();
    return about;
  }

  async setErrorCorrection(bits: number): Promise<void> {
    await this.button('Detection settings').click();
    await this.errorCorrection(bits).check();
    await this.page.keyboard.press('Escape');
    await expect(this.detectionSettings()).toBeHidden();
  }

  async expectErrorCorrection(bits: number): Promise<void> {
    await this.button('Detection settings').click();
    await expect(this.errorCorrection(bits)).toBeChecked();
    await this.page.keyboard.press('Escape');
  }

  /** Asserts the warning about correcting more bits than is safe. */
  async expectErrorCorrectionWarning(shown: boolean): Promise<void> {
    // Flagged on the button without opening the panel...
    const description = shown ? /may get the wrong ID/ : '';
    await expect(this.button('Detection settings')).toHaveAccessibleDescription(
      description
    );
    // ...and explained inside it.
    await this.button('Detection settings').click();
    await expect(
      this.detectionSettings().getByText('may get the wrong ID')
    ).toBeVisible({ visible: shown });
    await this.page.keyboard.press('Escape');
  }

  async setHighResolution(enabled: boolean): Promise<void> {
    await this.button('Detection settings').click();
    await this.detectionSettings()
      .getByRole('switch', { name: /^High Resolution/ })
      .setChecked(enabled);
    await this.page.keyboard.press('Escape');
    await expect(this.detectionSettings()).toBeHidden();
  }

  /** Enters the IDs of tags to find, e.g. `'1, 5-7'`. */
  async findTags(ids: string): Promise<void> {
    if (!(await this.findInput().isVisible())) {
      await this.openMenu();
      await this.page.getByRole('menuitem', { name: 'Find Tags' }).click();
    }
    // Typed key by key, so key presses reach the page as they would by hand.
    await this.findInput().clear();
    await this.findInput().pressSequentially(ids);
    await this.findInput().press('Enter');
  }

  async stopFindingTags(): Promise<void> {
    await this.button('Stop finding tags').click();
    await this.expectTagsToFind(null);
  }

  /** Asserts the IDs entered to find tags, as typed, or that there are none. */
  async expectTagsToFind(
    ids: string | null,
    { invalid = false }: { invalid?: boolean } = {}
  ): Promise<void> {
    if (ids === null) {
      await expect(this.findInput()).toBeHidden();
      return;
    }
    await expect(this.findInput()).toHaveValue(ids);
    await expect(this.findInput()).toHaveAttribute(
      'aria-invalid',
      String(invalid)
    );
  }

  async expectFindTagsFocused(): Promise<void> {
    await expect(this.findInput()).toBeFocused();
  }

  async pressShortcut(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  private findInput() {
    return this.page.getByRole('textbox', { name: 'Tags to find' });
  }

  private detectionSettings() {
    return this.page.getByRole('dialog', { name: 'Detection' });
  }

  private errorCorrection(bits: number) {
    return this.detectionSettings().getByRole('radio', {
      name: `${bits} bits`,
    });
  }

  async setTagIdSize(size: string): Promise<void> {
    await this.button('View options').click();
    await this.tagIdSize(size).check();
    await this.page.keyboard.press('Escape');
    await expect(this.viewOptions()).toBeHidden();
  }

  async expectTagIdSize(size: string): Promise<void> {
    await this.button('View options').click();
    await expect(this.tagIdSize(size)).toBeChecked();
    await this.page.keyboard.press('Escape');
  }

  async setFillScreen(enabled: boolean): Promise<void> {
    await this.button('View options').click();
    await this.fillScreen().setChecked(enabled);
    await this.page.keyboard.press('Escape');
    await expect(this.viewOptions()).toBeHidden();
  }

  async expectFillScreen(enabled: boolean): Promise<void> {
    await this.button('View options').click();
    await expect(this.fillScreen()).toBeChecked({ checked: enabled });
    await this.page.keyboard.press('Escape');
  }

  private fillScreen() {
    return this.viewOptions().getByRole('switch', { name: /^Fill Screen/ });
  }

  private viewOptions() {
    return this.page.getByRole('dialog', { name: 'View Options' });
  }

  private tagIdSize(size: string) {
    return this.viewOptions().getByRole('radio', { name: size });
  }

  private mode(mode: 'Scan' | 'Collect') {
    return this.page
      .getByRole('radiogroup', { name: 'Mode' })
      .getByRole('radio', { name: mode });
  }

  async saveImage(): Promise<SavedFile> {
    await this.openMenu();
    return this.saveFile(
      this.page.getByRole('menuitem', { name: 'Save Image' })
    );
  }

  /** Saves the list of tags in view. */
  async saveTagList(): Promise<SavedFile> {
    await this.openMenu();
    return this.saveFile(
      this.page.getByRole('menuitem', { name: 'Save Tag List' })
    );
  }

  async saveCollectedTags(): Promise<SavedFile> {
    return this.saveFile(this.button('Save Tag List'));
  }

  private async saveFile(control: {
    click(): Promise<void>;
  }): Promise<SavedFile> {
    const download = this.page.waitForEvent('download');
    await control.click();
    const file = await download;
    return {
      name: file.suggestedFilename(),
      content: await readFile(await file.path()),
    };
  }

  async uploadImage(file: ImageFile): Promise<void> {
    const fileChooser = this.page.waitForEvent('filechooser');
    await this.openMenu();
    await this.page.getByRole('menuitem', { name: 'Upload Image' }).click();
    await (await fileChooser).setFiles(file);
    await expect(this.button('Close image')).toBeVisible();
  }

  /** Asserts the set of tags currently detected (order-insensitive). */
  async expectDetectedTags(
    ids: number[],
    options?: { stableForMs?: number }
  ): Promise<void> {
    await this.expectTagReadout('data-tag-ids', ids, options);
  }

  /** Asserts which detected tags are highlighted as being searched for. */
  async expectFoundTags(
    ids: number[],
    options?: { stableForMs?: number }
  ): Promise<void> {
    await this.expectTagReadout('data-found-tag-ids', ids, options);
  }

  /**
   * Asserts a set of tag IDs in the readout (order-insensitive).
   *
   * A matching reading can be transient — e.g. stale detections that have not
   * yet been replaced by the next frame — so once it matches, it must keep
   * matching for `stableForMs`.
   */
  private async expectTagReadout(
    attribute: string,
    ids: number[],
    { stableForMs = 500 }: { stableForMs?: number } = {}
  ): Promise<void> {
    const expected = [...ids].sort((a, b) => a - b).join(',');
    const readout = this.page.getByTestId('detected-tags');
    await expect(readout).toHaveAttribute(attribute, expected);

    const deadline = Date.now() + stableForMs;
    while (Date.now() < deadline) {
      await this.page.waitForTimeout(50);
      expect(
        await readout.getAttribute(attribute),
        `${attribute} changed within ${stableForMs}ms of matching`
      ).toBe(expected);
    }
  }

  async expectDuplicateWarning(text: string | RegExp | null): Promise<void> {
    const alert = this.page.getByRole('alert');
    if (text === null) await expect(alert).toBeHidden();
    else await expect(alert).toHaveText(text);
  }

  async expectStatus(text: string | RegExp): Promise<void> {
    await expect(this.page.getByRole('status')).toHaveText(text);
  }

  /** Asserts the entries shown in the collected-tags summary, e.g. `['0-7']`. */
  async expectCollectedTags(entries: string[]): Promise<void> {
    if (entries.length === 0) {
      await expect(
        this.page.getByText('No tags seen while collecting')
      ).toBeVisible();
      return;
    }
    await expect(
      this.page
        .getByRole('list', { name: 'Collected tags' })
        .getByRole('listitem')
    ).toHaveText(entries);
  }

  private button(name: string) {
    return this.page.getByRole('button', { name, exact: true });
  }

  private familySelect() {
    return this.page.getByRole('combobox', { name: 'Tag family' });
  }

  private menuButton() {
    return this.page.getByRole('button', { name: 'More options' });
  }

  private async openMenu(): Promise<void> {
    const menu = this.page.getByRole('menu');
    if (!(await menu.isVisible())) await this.menuButton().click();
    await expect(menu).toBeVisible();
  }
}
