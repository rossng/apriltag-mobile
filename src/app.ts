import { LitElement, html, svg } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { detect, FAMILIES, findDuplicateIds, type Detection } from './detector';
import { drawOverlay, pixels } from './canvas';

type View =
  | { kind: 'live' }
  | { kind: 'paused' | 'image'; image: ImageData }
  | { kind: 'recording'; seen: Set<number> }
  | { kind: 'results'; ids: number[] };

const FAMILY_KEY = 'selectedFamily';
const EXAMPLE = { url: 'sample.jpg', family: 'tagStandard52h13' };

@customElement('apriltag-app')
export class AprilTagApp extends LitElement {
  @state() private view: View = { kind: 'live' };
  @state() private family = localStorage.getItem(FAMILY_KEY) ?? 'tag36h11';
  @state() private recordMode = false;
  @state() private cover = true;
  @state() private detections: Detection[] = [];
  @state() private stream: MediaStream | null = null;
  @state() private hasFrame = false;
  @state() private cameras: MediaDeviceInfo[] = [];
  @state() private status = '';

  @query('video') private video!: HTMLVideoElement;
  @query('canvas') private canvas!: HTMLCanvasElement;
  @query('[popover]') private menu!: HTMLElement;
  @query('input[type=file]') private fileInput!: HTMLInputElement;

  private frameCallback = 0;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.startCamera();
    // Mobile browsers can stop the camera video while the page is hidden.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.stream) this.attachStream();
    });
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has('family')) localStorage.setItem(FAMILY_KEY, this.family);
    if (changed.has('view') || changed.has('family')) {
      const v = this.view;
      if (v.kind === 'paused' || v.kind === 'image') {
        this.detections = detect(v.image, this.family);
      } else if (changed.has('view')) {
        this.detections = [];
      }
    }
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('stream')) this.attachStream();
    const still = 'image' in this.view ? this.view.image : undefined;
    const { videoWidth: width, videoHeight: height } = this.video;
    drawOverlay(
      this.canvas,
      this.detections,
      still ?? { width, height },
      still
    );
  }

  private async startCamera(deviceId?: string) {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.hasFrame = false;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          ...(deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: { ideal: 'environment' } }),
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.cameras = devices.filter((d) => d.kind === 'videoinput');
      this.status = '';
    } catch {
      this.stream = null;
      this.status = deviceId
        ? 'Failed to switch camera. Please try again.'
        : 'Camera access denied. Please allow camera permissions and refresh.';
    }
  }

  private nextCamera() {
    const current = this.stream?.getVideoTracks()[0]?.getSettings().deviceId;
    const i = this.cameras.findIndex((c) => c.deviceId === current);
    this.startCamera(this.cameras[(i + 1) % this.cameras.length].deviceId);
  }

  /** Feeds every new camera frame to the detector while in a live view. */
  private attachStream() {
    this.video.srcObject = this.stream;
    this.video.cancelVideoFrameCallback(this.frameCallback);
    const onFrame = () => {
      this.hasFrame = true;
      const v = this.view;
      if (v.kind === 'live' || v.kind === 'recording') {
        const { videoWidth: width, videoHeight: height } = this.video;
        this.detections = detect(
          pixels(this.video, width, height),
          this.family
        );
        if (v.kind === 'recording') {
          for (const { id } of this.detections) v.seen.add(id);
        }
      }
      this.frameCallback = this.video.requestVideoFrameCallback(onFrame);
    };
    this.frameCallback = this.video.requestVideoFrameCallback(onFrame);
  }

  private async showImage(blob: Blob | Promise<Blob>, family?: string) {
    try {
      const bitmap = await createImageBitmap(await blob);
      this.view = {
        kind: 'image',
        image: pixels(bitmap, bitmap.width, bitmap.height),
      };
      if (family) this.family = family;
      this.status = '';
    } catch {
      this.status = 'Failed to load image';
    }
  }

  private stopRecording() {
    if (this.view.kind !== 'recording') return;
    this.view = {
      kind: 'results',
      ids: [...this.view.seen].sort((a, b) => a - b),
    };
  }

  private mainButton() {
    const v = this.view;
    const live = { kind: 'live' } as const;
    switch (v.kind) {
      case 'image':
        return {
          label: 'Close image',
          icon: ICONS.close,
          action: () => (this.view = live),
        };
      case 'paused':
        return {
          label: 'Resume',
          icon: ICONS.play,
          action: () => (this.view = live),
        };
      case 'recording':
        return {
          label: 'Stop recording',
          icon: ICONS.stop,
          action: () => this.stopRecording(),
        };
    }
    const disabled = v.kind === 'results' || !this.hasFrame;
    return this.recordMode
      ? {
          label: 'Start recording',
          icon: ICONS.record,
          disabled,
          action: () => (this.view = { kind: 'recording', seen: new Set() }),
        }
      : {
          label: 'Pause',
          icon: ICONS.pause,
          disabled,
          action: () => {
            const { videoWidth: width, videoHeight: height } = this.video;
            this.view = {
              kind: 'paused',
              image: pixels(this.video, width, height),
            };
          },
        };
  }

  render() {
    const v = this.view;
    const busy = v.kind === 'recording' || v.kind === 'results';
    const button = this.mainButton();
    const ids = this.detections.map((d) => d.id).sort((a, b) => a - b);
    const duplicates =
      v.kind === 'results' ? [] : findDuplicateIds(this.detections);
    const closeMenuThen = (action: () => void) => () => {
      this.menu.hidePopover();
      action();
    };

    return html`
      <header>
        <h1>AprilTag Detector</h1>
        <select
          aria-label="Tag family"
          ?disabled=${busy}
          title=${busy ? 'Family selection is disabled while recording' : ''}
          @change=${(e: Event) => (this.family = (e.target as HTMLSelectElement).value)}
        >
          ${Object.entries(FAMILIES).map(
            ([id, count]) =>
              html`<option value=${id} .selected=${id === this.family}>
                ${id} (${count} tags)
              </option>`
          )}
        </select>
        <button
          class="menu-button"
          popovertarget="menu"
          aria-label="More options"
        >
          ${ICONS.more}
        </button>
        <div id="menu" popover role="menu" aria-label="More options">
          <button
            role="menuitemcheckbox"
            aria-checked=${this.recordMode}
            @click=${() => {
              this.recordMode = !this.recordMode;
              if (!this.recordMode) this.stopRecording();
            }}
          >
            Record Mode
          </button>
          <button
            role="menuitemcheckbox"
            aria-checked=${this.cover}
            ?disabled=${v.kind === 'image' || v.kind === 'results'}
            title="Fill the screen with the camera view, cropping its edges"
            @click=${() => (this.cover = !this.cover)}
          >
            Cover Mode
          </button>
          ${
            this.cameras.length > 1
              ? html`<button
                  role="menuitem"
                  @click=${closeMenuThen(() => this.nextCamera())}
                >
                  Switch Camera
                </button>`
              : ''
          }
          <button
            role="menuitem"
            ?disabled=${busy}
            @click=${closeMenuThen(() => this.fileInput.click())}
          >
            Select Image
          </button>
          <button
            role="menuitem"
            ?disabled=${busy}
            @click=${closeMenuThen(() =>
              this.showImage(
                fetch(EXAMPLE.url).then((r) => r.blob()),
                EXAMPLE.family
              )
            )}
          >
            View Example
          </button>
          <a
            role="menuitem"
            href="https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html"
            target="_blank"
            rel="noopener"
          >
            What are AprilTags?
          </a>
        </div>
        <input
          type="file"
          accept="image/*"
          hidden
          @change=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            if (input.files?.[0]) this.showImage(input.files[0]);
            input.value = '';
          }}
        />
      </header>

      <main class=${this.cover && v.kind !== 'image' ? 'cover' : ''}>
        <video autoplay muted playsinline></video>
        <canvas class=${'image' in v ? 'still' : ''}></canvas>
        <div class="notices">
          <p role="status">${this.status}</p>
          ${
            duplicates.length
              ? html`<p role="alert">
                  Duplicate marker${duplicates.length > 1 ? 's' : ''}:
                  ${duplicates.join(', ')}
                </p>`
              : ''
          }
        </div>
        ${
          v.kind === 'results'
            ? renderResults(v.ids, () => (this.view = { kind: 'live' }))
            : html`<p
                class="visually-hidden"
                data-testid="detected-tags"
                data-tag-ids=${ids.join(',')}
              >
                ${ids.length ? `Detected tags: ${ids.join(', ')}` : 'No tags detected'}
              </p>`
        }
      </main>

      <footer>
        <button
          class="capture"
          aria-label=${button.label}
          ?disabled=${button.disabled}
          @click=${button.action}
        >
          ${button.icon}
        </button>
      </footer>

      <a
        class="about"
        href="https://github.com/rossng/apriltag-mobile"
        target="_blank"
        rel="noopener"
        aria-label="About"
      >
        ${ICONS.about}
      </a>
    `;
  }
}

function renderResults(ids: number[], close: () => void) {
  return html`
    <section class="results">
      <h2>Recorded Tags</h2>
      ${
        ids.length
          ? html`<p>
                ${ids.length} unique tag${ids.length === 1 ? '' : 's'} detected
              </p>
              <ul role="list" aria-label="Recorded tags">
                ${idRanges(ids).map(
                  (entry) =>
                    html`<li class=${entry.includes('-') ? 'range' : ''}>
                      ${entry}
                    </li>`
                )}
              </ul>`
          : html`<p>No tags detected during recording</p>`
      }
      <button class="close" aria-label="Close recorded tags" @click=${close}>
        ×
      </button>
    </section>
  `;
}

/** Summarises sorted, unique IDs, collapsing runs of three or more: 1-3, 5, 6. */
export function idRanges(ids: number[]): string[] {
  const entries: string[] = [];
  for (let start = 0; start < ids.length;) {
    let end = start;
    while (ids[end + 1] === ids[end] + 1) end++;
    if (end - start >= 2) entries.push(`${ids[start]}-${ids[end]}`);
    else for (let i = start; i <= end; i++) entries.push(String(ids[i]));
    start = end + 1;
  }
  return entries;
}

const icon = (content: unknown) =>
  html`<svg viewBox="0 0 24 24">${content}</svg>`;

const ICONS = {
  close: icon(
    svg`<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />`
  ),
  play: icon(svg`<path d="M8 5v14l11-7z" />`),
  pause: icon(
    svg`<rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />`
  ),
  record: icon(svg`<circle cx="12" cy="12" r="8" fill="red" />`),
  stop: icon(svg`<rect x="6" y="6" width="12" height="12" rx="2" />`),
  more: icon(
    svg`<circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />`
  ),
  about: icon(
    svg`<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />`
  ),
};
