import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  type JSX,
} from 'solid-js';
import {
  DEFAULT_ERROR_CORRECTION,
  detect,
  ERROR_CORRECTION_BITS,
  FAMILIES,
  findDuplicateIds,
  safeErrorCorrection,
  type Detection,
  type Point,
} from './detector';
import { FamilyPicker } from './family-picker';
import {
  drawOverlay,
  LABEL_SIZES,
  pixels,
  snapshot,
  toImagePoint,
  type LabelSize,
} from './canvas';

type View =
  | { kind: 'live' }
  | { kind: 'paused'; image: ImageData }
  | { kind: 'image'; image: ImageData; example: boolean }
  | { kind: 'collecting'; seen: Set<number> }
  | { kind: 'results'; ids: number[] };

type Size = { width: number; height: number };

/** What the shutter does: freeze a frame, or collect every ID seen. */
type Mode = 'scan' | 'collect';
const MODES: Record<Mode, string> = { scan: 'Scan', collect: 'Collect' };

const FAMILY_KEY = 'selectedFamily';
const DUPLICATES_KEY = 'detectDuplicates';
const LABEL_SIZE_KEY = 'labelSize';
const ERROR_CORRECTION_KEY = 'errorCorrection';
const EXAMPLE = { url: 'sample.jpg', family: 'tagStandard52h13' };

export function App() {
  const [view, setView] = createSignal<View>({ kind: 'live' });
  const saved = localStorage.getItem(FAMILY_KEY) ?? '';
  const [family, setFamily] = createSignal(
    saved in FAMILIES ? saved : 'tag36h11'
  );
  /** How many misread bits to correct in each tag. */
  const savedBits = localStorage.getItem(ERROR_CORRECTION_KEY);
  const [bits, setBits] = createSignal(
    ERROR_CORRECTION_BITS.find((n) => String(n) === savedBits) ??
      DEFAULT_ERROR_CORRECTION
  );
  /** A warning when correcting more bits than the family can safely. */
  const bitsWarning = () => {
    const safe = safeErrorCorrection(family());
    return bits() > safe
      ? `${family()} can only reliably correct ${safe} bits, so tags may get the wrong ID.`
      : '';
  };
  const [mode, setMode] = createSignal<Mode>('scan');
  /** How many unique IDs have been seen while collecting. */
  const [collected, setCollected] = createSignal(0);
  const [detectDuplicates, setDetectDuplicates] = createSignal(
    localStorage.getItem(DUPLICATES_KEY) === 'true'
  );
  const [cover, setCover] = createSignal(true);
  const savedSize = localStorage.getItem(LABEL_SIZE_KEY) ?? '';
  const [labelSize, setLabelSize] = createSignal<LabelSize>(
    savedSize in LABEL_SIZES ? (savedSize as LabelSize) : 'auto'
  );
  /** Where the user is pointing, to bring that tag's ID to the front. */
  const [focus, setFocus] = createSignal<Point | null>(null);
  const [liveDetections, setLiveDetections] = createSignal<Detection[]>([]);
  /** Camera frame size, or null until the camera has produced a frame. */
  const [frameSize, setFrameSize] = createSignal<Size | null>(null, {
    equals: (a, b) => a?.width === b?.width && a?.height === b?.height,
  });
  const [cameras, setCameras] = createSignal<MediaDeviceInfo[]>([]);
  const [status, setStatus] = createSignal('');

  let video!: HTMLVideoElement;
  let canvas!: HTMLCanvasElement;
  let menu!: HTMLDivElement;
  let fileInput!: HTMLInputElement;
  let stream: MediaStream | undefined;
  let frameCallback = 0;

  const still = () => {
    const v = view();
    return v.kind === 'paused' || v.kind === 'image' ? v.image : undefined;
  };
  const busy = () => view().kind === 'collecting' || view().kind === 'results';
  const detections = createMemo(() => {
    const image = still();
    return image ? detect(image, family(), bits()) : liveDetections();
  });
  const ids = () =>
    detections()
      .map((d) => d.id)
      .sort((a, b) => a - b);
  const results = () => {
    const v = view();
    return v.kind === 'results' ? v.ids : undefined;
  };
  const duplicates = () =>
    detectDuplicates() && !results() ? findDuplicateIds(detections()) : [];

  createEffect(() => localStorage.setItem(FAMILY_KEY, family()));
  createEffect(() =>
    localStorage.setItem(DUPLICATES_KEY, String(detectDuplicates()))
  );
  createEffect(() => localStorage.setItem(LABEL_SIZE_KEY, labelSize()));
  createEffect(() =>
    localStorage.setItem(ERROR_CORRECTION_KEY, String(bits()))
  );

  // A tapped point means nothing once the picture changes.
  createEffect(() => {
    view();
    setFocus(null);
  });

  createEffect(() => {
    cover(); // Label sizes depend on object-fit.
    const image = still();
    const size = image ?? frameSize() ?? { width: 0, height: 0 };
    drawOverlay(canvas, detections(), size, {
      image,
      duplicateIds: duplicates(),
      labelSize: labelSize(),
      focus: focus(),
    });
  });

  /** Focuses the tag under the mouse, or under a tap on touch screens. */
  const pointAt = (hover: boolean) => (e: PointerEvent) => {
    if ((e.pointerType === 'mouse') === hover) {
      setFocus(toImagePoint(canvas, e.clientX, e.clientY));
    }
  };

  // Swiping sideways across the live view switches mode, as in camera apps.
  let swipeFrom: Point | undefined;
  const startSwipe = (e: PointerEvent) => {
    swipeFrom =
      e.pointerType === 'mouse' ? undefined : { x: e.clientX, y: e.clientY };
  };
  const endSwipe = (e: PointerEvent) => {
    if (!swipeFrom || view().kind !== 'live') return;
    const dx = e.clientX - swipeFrom.x;
    const dy = e.clientY - swipeFrom.y;
    swipeFrom = undefined;
    if (Math.abs(dx) > 50 && Math.abs(dx) > 2 * Math.abs(dy)) {
      setMode(dx < 0 ? 'collect' : 'scan');
    }
  };

  /** Feeds every new camera frame to the detector while in a live view. */
  function watchFrames() {
    video.cancelVideoFrameCallback(frameCallback);
    const onFrame = () => {
      const { videoWidth: width, videoHeight: height } = video;
      setFrameSize({ width, height });
      const v = view();
      if (v.kind === 'live' || v.kind === 'collecting') {
        const found = detect(pixels(video, width, height), family(), bits());
        setLiveDetections(found);
        if (v.kind === 'collecting') {
          for (const { id } of found) v.seen.add(id);
          setCollected(v.seen.size);
        }
      }
      frameCallback = video.requestVideoFrameCallback(onFrame);
    };
    frameCallback = video.requestVideoFrameCallback(onFrame);
  }

  async function startCamera(deviceId?: string) {
    stream?.getTracks().forEach((track) => track.stop());
    setFrameSize(null);
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          ...(deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: { ideal: 'environment' } }),
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      video.srcObject = stream;
      watchFrames();
      const devices = await navigator.mediaDevices.enumerateDevices();
      setCameras(devices.filter((d) => d.kind === 'videoinput'));
      setStatus('');
    } catch {
      stream = undefined;
      setStatus(
        deviceId
          ? 'Failed to switch camera. Please try again.'
          : 'Camera access denied. Please allow camera permissions and refresh.'
      );
    }
  }

  function nextCamera() {
    const current = stream?.getVideoTracks()[0]?.getSettings().deviceId;
    const i = cameras().findIndex((c) => c.deviceId === current);
    startCamera(cameras()[(i + 1) % cameras().length].deviceId);
  }

  onMount(() => {
    startCamera();
    // Mobile browsers can stop the camera video while the page is hidden.
    const onVisible = () => {
      if (document.hidden || !stream) return;
      video.srcObject = stream;
      watchFrames();
    };
    document.addEventListener('visibilitychange', onVisible);
    onCleanup(() => {
      document.removeEventListener('visibilitychange', onVisible);
      stream?.getTracks().forEach((track) => track.stop());
    });
  });

  async function showImage(
    blob: Blob | Promise<Blob>,
    example?: typeof EXAMPLE
  ) {
    try {
      const bitmap = await createImageBitmap(await blob);
      const image = pixels(bitmap, bitmap.width, bitmap.height);
      batch(() => {
        setView({ kind: 'image', image, example: !!example });
        if (example) setFamily(example.family);
        setStatus('');
      });
    } catch {
      setStatus('Failed to load image');
    }
  }

  /** Whether there's a picture, live or still, to export. */
  const exportable = () => !results() && !!(still() || frameSize());

  async function saveImage() {
    const blob = await snapshot(canvas, still() ? undefined : video);
    download(blob, fileName(family(), 'png'));
  }

  function goLive() {
    setLiveDetections([]);
    setView({ kind: 'live' });
  }

  function stopCollecting() {
    const v = view();
    if (v.kind !== 'collecting') return;
    setView({ kind: 'results', ids: [...v.seen].sort((a, b) => a - b) });
  }

  const button = createMemo(() => {
    const v = view();
    switch (v.kind) {
      case 'image':
        return {
          label: v.example ? 'Close example' : 'Close image',
          icon: ICONS.close,
          action: goLive,
          // Shown as text too: the button no longer controls the camera.
          spelledOut: true,
        };
      case 'paused':
        return { label: 'Resume', icon: ICONS.play, action: goLive };
      case 'collecting':
        return {
          label: 'Stop collecting',
          icon: ICONS.stop,
          action: stopCollecting,
        };
    }
    const disabled = view().kind === 'results' || !frameSize();
    return mode() === 'collect'
      ? {
          label: 'Start collecting',
          icon: ICONS.record,
          disabled,
          action: () =>
            batch(() => {
              setCollected(0);
              setView({ kind: 'collecting', seen: new Set<number>() });
            }),
        }
      : {
          label: 'Pause',
          icon: ICONS.pause,
          disabled,
          action: () => {
            const { width, height } = frameSize()!;
            setView({ kind: 'paused', image: pixels(video, width, height) });
          },
        };
  });

  const closeMenuThen = (action: () => void) => () => {
    menu.hidePopover();
    action();
  };

  return (
    <>
      <header>
        <h1>
          {ICONS.logo()}
          <span>AprilTag Detector</span>
        </h1>
        <div class="detection">
          <FamilyPicker
            value={family()}
            disabled={busy()}
            title={
              busy() ? 'Family selection is disabled while collecting' : ''
            }
            onChange={setFamily}
          />
          <button
            class="detection-button"
            popovertarget="detection-settings"
            aria-label="Detection settings"
            aria-describedby={bitsWarning() ? 'bits-warning' : undefined}
            disabled={busy()}
            title={
              busy()
                ? 'Detection settings are locked while collecting'
                : bitsWarning()
            }
          >
            {ICONS.settings()}
            <Show when={bitsWarning()}>
              <span class="warning-badge">!</span>
            </Show>
          </button>
          <div
            id="detection-settings"
            class="panel"
            popover
            role="dialog"
            aria-labelledby="detection-settings-title"
          >
            <h2 id="detection-settings-title">Detection</h2>
            <fieldset>
              <legend>Error Correction</legend>
              <div class="segmented">
                <For each={ERROR_CORRECTION_BITS}>
                  {(n) => (
                    <label>
                      <input
                        type="radio"
                        name="error-correction"
                        value={n}
                        checked={bits() === n}
                        onChange={() => setBits(n)}
                      />
                      {n}
                      <span class="visually-hidden"> bits</span>
                    </label>
                  )}
                </For>
              </div>
            </fieldset>
            <p class="hint">
              {bits()
                ? `Fixes up to ${bits()} misread bit${bits() === 1 ? '' : 's'} per tag. More finds worn or blurry tags but risks false detections.`
                : 'Exact matches only: fewest false detections, but misses worn or blurry tags.'}
            </p>
            <Show when={bitsWarning()}>
              <p id="bits-warning" class="warning">
                {bitsWarning()}
              </p>
            </Show>
          </div>
        </div>
        <button
          class="menu-button"
          popovertarget="menu"
          aria-label="More options"
        >
          {ICONS.more()}
        </button>
        <div ref={menu} id="menu" popover role="menu" aria-label="More options">
          <Show when={cameras().length > 1}>
            <button role="menuitem" onClick={closeMenuThen(nextCamera)}>
              Switch Camera
            </button>
          </Show>
          <button
            role="menuitem"
            disabled={busy()}
            onClick={closeMenuThen(() => fileInput.click())}
          >
            Upload Image
          </button>
          <button
            role="menuitem"
            disabled={busy()}
            onClick={closeMenuThen(() =>
              showImage(
                fetch(EXAMPLE.url).then((r) => r.blob()),
                EXAMPLE
              )
            )}
          >
            Try Example Image
          </button>
          <div role="separator" />
          <button
            role="menuitem"
            disabled={!exportable()}
            onClick={closeMenuThen(saveImage)}
          >
            Save Image
          </button>
          <button
            role="menuitem"
            disabled={!exportable()}
            onClick={closeMenuThen(() =>
              download(tagList(ids()), fileName(family(), 'txt'))
            )}
          >
            Save Tag List
          </button>
          <div role="separator" />
          <a
            role="menuitem"
            href="https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html"
            target="_blank"
            rel="noopener"
          >
            What are AprilTags?
          </a>
          <button
            role="menuitem"
            onClick={closeMenuThen(() =>
              document.getElementById('about')!.showPopover()
            )}
          >
            About
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            if (file) showImage(file);
            e.currentTarget.value = '';
          }}
        />
      </header>

      <main
        classList={{ cover: cover() && view().kind !== 'image' }}
        onPointerDown={startSwipe}
        onPointerUp={endSwipe}
      >
        <video ref={video} autoplay muted playsinline />
        <canvas
          ref={canvas}
          classList={{ still: !!still() }}
          onPointerMove={pointAt(true)}
          onPointerDown={pointAt(false)}
          onPointerLeave={(e) => e.pointerType === 'mouse' && setFocus(null)}
        />
        <div class="notices">
          <p role="status">{status()}</p>
          <Show when={duplicates().length}>
            <p role="alert">
              Duplicate tag ID{duplicates().length > 1 ? 's' : ''}:{' '}
              {duplicates().join(', ')}
            </p>
          </Show>
        </div>
        <Show
          when={results()}
          fallback={
            <p
              class="visually-hidden"
              data-testid="detected-tags"
              data-tag-ids={ids().join(',')}
            >
              {ids().length
                ? `Detected tags: ${ids().join(', ')}`
                : 'No tags detected'}
            </p>
          }
        >
          {(ids) => (
            <Results
              ids={ids()}
              onSave={() =>
                download(
                  tagList(ids()),
                  fileName(`${family()}-collected`, 'txt')
                )
              }
              onClose={goLive}
            />
          )}
        </Show>
      </main>

      <footer>
        <div class="modes" role="radiogroup" aria-label="Mode">
          <For each={Object.entries(MODES)}>
            {([value, name]) => (
              <label>
                <input
                  type="radio"
                  name="mode"
                  value={value}
                  checked={mode() === value}
                  disabled={busy()}
                  onChange={() => setMode(value as Mode)}
                />
                {name}
              </label>
            )}
          </For>
        </div>
        {/* Screen readers get this from the detected-tags readout instead. */}
        <Show when={view().kind !== 'results' && (still() || frameSize())}>
          <p class="readout" aria-hidden="true">
            <Show
              when={view().kind === 'collecting'}
              fallback={
                <>
                  <b>{ids().length}</b> tag{ids().length === 1 ? '' : 's'}
                  <Show when={view().kind === 'paused'}>
                    <small>Paused</small>
                  </Show>
                </>
              }
            >
              <b>{collected()}</b> collected
            </Show>
          </p>
        </Show>
        <button
          class="capture"
          data-state={view().kind}
          data-collect={button().icon === ICONS.record || undefined}
          aria-label={button().label}
          disabled={button().disabled}
          onClick={() => button().action()}
        >
          {button().icon()}
          <Show when={button().spelledOut}>
            <span>{button().label}</span>
          </Show>
        </button>
        <button
          class="view-button"
          popovertarget="view-options"
          aria-label="View options"
        >
          {ICONS.view()}
        </button>
        <div
          id="view-options"
          class="panel"
          popover
          role="dialog"
          aria-labelledby="view-options-title"
        >
          <h2 id="view-options-title">View Options</h2>
          <label class="option">
            <span>
              Fill Screen
              <small>Crop the camera view to fill the screen</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={cover()}
              disabled={view().kind === 'image' || view().kind === 'results'}
              onChange={(e) => setCover(e.currentTarget.checked)}
            />
          </label>
          <label class="option">
            <span>
              Highlight Duplicate IDs
              <small>Warn when the same ID appears more than once</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={detectDuplicates()}
              onChange={(e) => setDetectDuplicates(e.currentTarget.checked)}
            />
          </label>
          <fieldset>
            <legend>Tag ID Size</legend>
            <div class="segmented">
              <For each={Object.entries(LABEL_SIZES)}>
                {([value, name]) => (
                  <label>
                    <input
                      type="radio"
                      name="label-size"
                      value={value}
                      checked={labelSize() === value}
                      onChange={() => setLabelSize(value as LabelSize)}
                    />
                    {name}
                  </label>
                )}
              </For>
            </div>
          </fieldset>
          <p class="hint">
            <span class="hover">Hover over</span>
            <span class="tap">Tap</span> a tag to bring its ID to the front.
          </p>
        </div>
      </footer>
    </>
  );
}

function Results(props: {
  ids: number[];
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <section class="results">
      <h2>Collected Tags</h2>
      <Show
        when={props.ids.length}
        fallback={<p>No tags seen while collecting</p>}
      >
        <p>
          <span class="count">{props.ids.length}</span>
          unique tag{props.ids.length === 1 ? '' : 's'} detected
        </p>
        <ul role="list" aria-label="Collected tags">
          <For each={idRanges(props.ids)}>{(entry) => <li>{entry}</li>}</For>
        </ul>
      </Show>
      <div class="actions">
        <Show when={props.ids.length}>
          <button onClick={props.onSave}>
            {ICONS.save()}
            Save Tag List
          </button>
        </Show>
        <button aria-label="Close collected tags" onClick={props.onClose}>
          {ICONS.close()}
          Close
        </button>
      </div>
    </section>
  );
}

/** One ID per line. */
function tagList(ids: number[]): Blob {
  return new Blob([ids.map((id) => `${id}\n`).join('')], {
    type: 'text/plain',
  });
}

/** e.g. apriltags-tag36h11-2026-10-12-143005.png */
function fileName(label: string, extension: string): string {
  const time = new Date().toISOString().slice(0, 19).replace('T', '-');
  return `apriltags-${label}-${time.replaceAll(':', '')}.${extension}`;
}

function download(blob: Blob, name: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
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

const icon = (content: () => JSX.Element) => () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {content()}
  </svg>
);

const ICONS = {
  close: icon(() => (
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  )),
  play: icon(() => <path d="M8 5v14l11-7z" />),
  save: icon(() => (
    <path
      d="M12 4v11m-5-5 5 5 5-5M5 20h14"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  )),
  pause: icon(() => (
    <>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </>
  )),
  record: icon(() => <circle cx="12" cy="12" r="8" />),
  stop: icon(() => <rect x="6" y="6" width="12" height="12" rx="2" />),
  logo: icon(() => (
    <>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="2"
        fill="none"
        stroke="var(--cyan)"
        stroke-width="2"
      />
      <path
        fill="var(--cyan)"
        d="M6 6h4v4H6zM14 6h4v4h-4zM10 10h4v4h-4zM6 14h4v4H6z"
      />
      <path fill="var(--magenta)" d="M14 14h4v4h-4z" />
    </>
  )),
  // Feather's gear (MIT licence).
  settings: icon(() => (
    <g
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </g>
  )),
  more: icon(() => (
    <>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </>
  )),
  view: icon(() => (
    <path
      d="M4 7h9M17 7h3M4 17h3M11 17h9M15 4.5v5M9 14.5v5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  )),
};
