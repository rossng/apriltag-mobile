import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  For,
  on,
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
  drawableImage,
  drawScene,
  fitView,
  LABEL_SIZES,
  pixels,
  snapshot,
  type LabelSize,
  type Scene,
  type Size,
  type View as Placement,
} from './canvas';
import { createCameraControls } from './camera';
import { attachGestures } from './gestures';
import {
  MAX_ZOOM,
  NO_ZOOM,
  panBy,
  zoomBy,
  zoomedView,
  type Zoom,
} from './zoom';

type View =
  | { kind: 'live' }
  | { kind: 'paused'; image: ImageData }
  | { kind: 'image'; image: ImageData; example: boolean }
  | { kind: 'collecting'; seen: Set<number> }
  | { kind: 'results'; ids: number[] };

/** What the shutter does: freeze a frame, or collect every ID seen. */
type Mode = 'scan' | 'collect';
const MODES: Record<Mode, string> = { scan: 'Scan', collect: 'Collect' };

const FAMILY_KEY = 'selectedFamily';
const DUPLICATES_KEY = 'detectDuplicates';
const LABEL_SIZE_KEY = 'labelSize';
const FILL_SCREEN_KEY = 'fillScreen';
const ERROR_CORRECTION_KEY = 'errorCorrection';
const HIGH_RES_KEY = 'highResolution';
const FIND_KEY = 'findTags';
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
  const [highRes, setHighRes] = createSignal(
    localStorage.getItem(HIGH_RES_KEY) === 'true'
  );
  const [mode, setMode] = createSignal<Mode>('scan');
  /** How many unique IDs have been seen while collecting. */
  const [collected, setCollected] = createSignal(0);
  const [detectDuplicates, setDetectDuplicates] = createSignal(
    localStorage.getItem(DUPLICATES_KEY) === 'true'
  );
  const [cover, setCover] = createSignal(
    localStorage.getItem(FILL_SCREEN_KEY) !== 'false'
  );
  const savedSize = localStorage.getItem(LABEL_SIZE_KEY) ?? '';
  const [labelSize, setLabelSize] = createSignal<LabelSize>(
    savedSize in LABEL_SIZES ? (savedSize as LabelSize) : 'auto'
  );
  /** Where the user is pointing, to bring that tag's ID to the front. */
  const [focus, setFocus] = createSignal<Point | null>(null);
  /** The IDs of tags to find, as typed, e.g. "3, 7-9". */
  const [findText, setFindText] = createSignal(
    localStorage.getItem(FIND_KEY) ?? ''
  );
  const [finding, setFinding] = createSignal(findText() !== '');
  /** Detections in the still picture, or else the latest camera frame. */
  const [detections, setDetections] = createSignal<Detection[]>([]);
  /** Camera frame size, or null until the camera has produced a frame. */
  const [frameSize, setFrameSize] = createSignal<Size | null>(null, {
    equals: (a, b) => a?.width === b?.width && a?.height === b?.height,
  });
  const [cameras, setCameras] = createSignal<MediaDeviceInfo[]>([]);
  const [status, setStatus] = createSignal('');
  /** Why the camera isn't running, if it failed to start. */
  const [cameraError, setCameraError] = createSignal('');

  let video!: HTMLVideoElement;
  let canvas!: HTMLCanvasElement;
  let menu!: HTMLDivElement;
  let fileInput!: HTMLInputElement;
  let findInput: HTMLInputElement | undefined;
  let stream: MediaStream | undefined;
  let frameCallback = 0;

  const still = () => {
    const v = view();
    return v.kind === 'paused' || v.kind === 'image' ? v.image : undefined;
  };
  const busy = () => view().kind === 'collecting' || view().kind === 'results';
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
  const sought = createMemo(() =>
    parseIdRanges(findText(), FAMILIES[family()])
  );
  const isSought = (id: number) =>
    sought().ranges.some(([first, last]) => id >= first && id <= last);
  const detectOptions = () => ({
    family: family(),
    bits: bits(),
    highRes: highRes(),
  });

  createEffect(() => localStorage.setItem(FAMILY_KEY, family()));
  createEffect(() =>
    localStorage.setItem(DUPLICATES_KEY, String(detectDuplicates()))
  );
  createEffect(() => localStorage.setItem(LABEL_SIZE_KEY, labelSize()));
  createEffect(() => localStorage.setItem(FILL_SCREEN_KEY, String(cover())));
  createEffect(() =>
    localStorage.setItem(ERROR_CORRECTION_KEY, String(bits()))
  );
  createEffect(() => localStorage.setItem(HIGH_RES_KEY, String(highRes())));
  createEffect(() => localStorage.setItem(FIND_KEY, findText()));

  // IDs only identify tags within one family.
  createEffect(on(family, () => closeFind(), { defer: true }));

  // Until a still picture's tags are found, keep showing the old ones: when
  // pausing, those are the tags from the latest camera frame.
  createEffect(() => {
    const image = still();
    if (!image) return;
    let current = true;
    onCleanup(() => (current = false));
    detect(image, detectOptions()).then(
      (found) => current && setDetections(found)
    );
  });

  /** The camera view's size in CSS pixels. */
  const [box, setBox] = createSignal<Size>({ width: 0, height: 0 });
  const [zoom, setZoom] = createSignal<Zoom>(NO_ZOOM);
  /** Whether the picture is cropped to fill the view. */
  const filled = () => cover() && view().kind !== 'image';
  const pictureSize = () => still() ?? frameSize();
  /** Where the picture fits in the view, before zooming. */
  const fit = createMemo(() => {
    const size = pictureSize();
    return size && box().width ? fitView(size, box(), filled()) : undefined;
  });
  /** Where the picture appears in the view, in CSS pixels. */
  const shown = () => {
    const f = fit();
    return f && zoomedView(f, zoom());
  };
  const scene = (): Scene => ({
    detections: detections(),
    duplicateIds: duplicates(),
    isSought: sought().ranges.length ? isSought : undefined,
    labelSize: labelSize(),
    focus: focus(),
  });

  // A tapped point or zoom means nothing once the picture or view changes.
  createEffect(() => {
    view();
    box();
    setFocus(null);
    setZoom(NO_ZOOM);
  });

  // Gestures can change the view several times a frame, so draw whatever
  // is latest once per frame.
  let frame = 0;
  createEffect(() => {
    const drawing = {
      box: box(),
      view: shown(),
      scene: scene(),
      image: still(),
    };
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => draw(drawing));
  });
  onCleanup(() => cancelAnimationFrame(frame));

  function draw({
    box,
    view,
    scene,
    image,
  }: {
    box: Size;
    view?: Placement;
    scene: Scene;
    image?: ImageData;
  }) {
    // Draw at the screen's resolution, so labels stay sharp when zoomed in.
    const ratio = devicePixelRatio;
    const width = Math.round(box.width * ratio);
    const height = Math.round(box.height * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      Object.assign(canvas, { width, height });
    }
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, width, height);
    if (!view) return;
    drawScene(
      ctx,
      scene,
      { scale: view.scale * ratio, x: view.x * ratio, y: view.y * ratio },
      1 / view.scale,
      image && drawableImage(image)
    );
  }

  const camera = createCameraControls();
  const live = () => view().kind === 'live' || view().kind === 'collecting';
  /** Whether zooming zooms the camera rather than a still picture. */
  const cameraZoomable = () => live() && !!camera.range();

  /** The zoom level shown, relative to fitting the screen or the camera's widest. */
  const zoomLevel = () => (still() ? zoom().k : camera.zoom());
  const canZoomIn = () =>
    still() ? zoom().k < MAX_ZOOM : camera.zoom() < camera.range()!.max;
  const canZoomOut = () =>
    still() ? zoom().k > 1 : camera.zoom() > camera.range()!.min;

  /** Zooms the still picture or the camera, whichever is showing. */
  function zoomViewBy(factor: number, at?: Point) {
    if (still()) zoomStill(factor, at);
    else camera.zoomBy(factor);
  }

  function resetZoom() {
    if (still()) setZoom(NO_ZOOM);
    else camera.resetZoom();
  }

  /** Zooms the still picture, about the middle of the view by default. */
  function zoomStill(
    factor: number,
    at = { x: box().width / 2, y: box().height / 2 }
  ) {
    const f = fit();
    const image = still();
    if (f && image)
      setZoom((z) => zoomBy(z, factor, at, { fit: f, image, box: box() }));
  }

  function panStill(dx: number, dy: number) {
    const f = fit();
    const image = still();
    if (f && image)
      setZoom((z) => panBy(z, dx, dy, { fit: f, image, box: box() }));
  }

  /**
   * Feeds camera frames to the detector while in a live view, skipping those
   * that arrive while it's busy.
   */
  function watchFrames() {
    video.cancelVideoFrameCallback(frameCallback);
    let detecting = false;
    const onFrame = () => {
      frameCallback = video.requestVideoFrameCallback(onFrame);
      const { videoWidth: width, videoHeight: height } = video;
      setFrameSize({ width, height });
      const v = view();
      if (detecting || (v.kind !== 'live' && v.kind !== 'collecting')) return;
      detecting = true;
      const options = detectOptions();
      detect(pixels(video, width, height), options, { transfer: true })
        .then((found) => {
          // Drop results that are out of date.
          const now = detectOptions();
          const changed =
            now.family !== options.family ||
            now.bits !== options.bits ||
            now.highRes !== options.highRes;
          if (view() !== v || changed) return;
          setDetections(found);
          if (v.kind === 'collecting') {
            for (const { id } of found) v.seen.add(id);
            setCollected(v.seen.size);
          }
        })
        .finally(() => (detecting = false));
    };
    frameCallback = video.requestVideoFrameCallback(onFrame);
  }

  async function startCamera(deviceId?: string) {
    stream?.getTracks().forEach((track) => track.stop());
    setFrameSize(null);
    setCameraError('');
    camera.use();
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          ...(deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: { ideal: 'environment' } }),
          width: { ideal: highRes() ? 1920 : 1280 },
          height: { ideal: highRes() ? 1080 : 720 },
        },
      });
      video.srcObject = stream;
      camera.use(stream.getVideoTracks()[0]);
      watchFrames();
      const devices = await navigator.mediaDevices.enumerateDevices();
      setCameras(devices.filter((d) => d.kind === 'videoinput'));
    } catch (e) {
      stream = undefined;
      const reason = (e as DOMException).name;
      setCameraError(
        reason === 'NotAllowedError'
          ? 'Camera access denied. Allow it in your browser’s site settings and try again, or detect tags in an image instead.'
          : reason === 'NotFoundError' || reason === 'OverconstrainedError'
            ? 'No camera found. You can still detect tags in an image.'
            : 'The camera couldn’t start. Try again, or detect tags in an image instead.'
      );
    }
  }

  const currentCamera = () =>
    stream?.getVideoTracks()[0]?.getSettings().deviceId;

  function nextCamera() {
    const i = cameras().findIndex((c) => c.deviceId === currentCamera());
    startCamera(cameras()[(i + 1) % cameras().length].deviceId);
  }

  onMount(() => {
    startCamera();

    const resize = new ResizeObserver(() => {
      const { width, height } = canvas.getBoundingClientRect();
      setBox({ width, height });
    });
    resize.observe(canvas);

    const detachGestures = attachGestures(canvas, {
      zoomable: () => !!still() || cameraZoomable(),
      pannable: () => !!still(),
      zoom: zoomViewBy,
      pan: panStill,
      toggleZoom: (at) =>
        canZoomOut() ? resetZoom() : zoomViewBy(still() ? 2.5 : 2, at),
      point: (at) => {
        const view = shown();
        setFocus(
          at && view
            ? {
                x: (at.x - view.x) / view.scale,
                y: (at.y - view.y) / view.scale,
              }
            : null
        );
      },
      // As in camera apps, swiping sideways switches mode.
      swipe: (direction) => {
        if (view().kind === 'live') {
          setMode(direction === 'left' ? 'collect' : 'scan');
        }
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (!(still() || cameraZoomable())) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if ((e.target as Element).closest('input, textarea')) return;
      if (e.key === '+' || e.key === '=') zoomViewBy(1.5);
      else if (e.key === '-') zoomViewBy(1 / 1.5);
      else if (e.key === '0') resetZoom();
    };
    document.addEventListener('keydown', onKeyDown);

    // Menu items with a keyboard shortcut say so in aria-keyshortcuts.
    const onShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if ((e.target as Element).closest('input, textarea')) return;
      if (!/^[a-z]$/i.test(e.key)) return;
      const item = menu.querySelector<HTMLElement>(
        `[aria-keyshortcuts="${e.key.toUpperCase()}"]`
      );
      if (!item) return;
      e.preventDefault();
      item.click();
    };
    document.addEventListener('keydown', onShortcut);

    onCleanup(() => {
      resize.disconnect();
      detachGestures();
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keydown', onShortcut);
    });
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

  function showExample() {
    showImage(
      fetch(EXAMPLE.url).then((r) => r.blob()),
      EXAMPLE
    );
  }

  async function showImage(
    blob: Blob | Promise<Blob>,
    example?: typeof EXAMPLE
  ) {
    try {
      const bitmap = await createImageBitmap(await blob);
      const image = pixels(bitmap, bitmap.width, bitmap.height);
      batch(() => {
        setView({ kind: 'image', image, example: !!example });
        setDetections([]);
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
    const image = still();
    const size = pictureSize();
    const f = fit();
    if (!size || !f) return;
    // Labels as they look on screen, without any zoom.
    const source = image ? drawableImage(image) : video;
    const blob = await snapshot(source, size, scene(), 1 / f.scale);
    download(blob, fileName(family(), 'png'));
  }

  function goLive() {
    setDetections([]);
    setView({ kind: 'live' });
  }

  function openFind() {
    setFinding(true);
    findInput?.focus();
  }

  function closeFind() {
    setFindText('');
    setFinding(false);
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
            <label class="option">
              <span>
                High Resolution
                <small>Find smaller tags, at a lower frame rate</small>
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={highRes()}
                onChange={(e) => {
                  setHighRes(e.currentTarget.checked);
                  if (stream) startCamera(currentCamera());
                }}
              />
            </label>
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
          <button
            role="menuitem"
            aria-keyshortcuts="F"
            onClick={closeMenuThen(openFind)}
          >
            Find Tags
            <Shortcut key="F" />
          </button>
          <div role="separator" />
          <Show when={cameras().length > 1}>
            <button
              role="menuitem"
              aria-keyshortcuts="C"
              onClick={closeMenuThen(nextCamera)}
            >
              Switch Camera
              <Shortcut key="C" />
            </button>
          </Show>
          <button
            role="menuitem"
            aria-keyshortcuts="U"
            disabled={busy()}
            onClick={closeMenuThen(() => fileInput.click())}
          >
            Upload Image
            <Shortcut key="U" />
          </button>
          <button
            role="menuitem"
            aria-keyshortcuts="E"
            disabled={busy()}
            onClick={closeMenuThen(showExample)}
          >
            Try Example Image
            <Shortcut key="E" />
          </button>
          <div role="separator" />
          <button
            role="menuitem"
            aria-keyshortcuts="S"
            disabled={!exportable()}
            onClick={closeMenuThen(saveImage)}
          >
            Save Image
            <Shortcut key="S" />
          </button>
          <button
            role="menuitem"
            aria-keyshortcuts="T"
            disabled={!exportable()}
            onClick={closeMenuThen(() =>
              download(tagList(ids()), fileName(family(), 'txt'))
            )}
          >
            Save Tag List
            <Shortcut key="T" />
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

      <main classList={{ cover: filled() }}>
        <video ref={video} autoplay muted playsinline />
        <canvas
          ref={canvas}
          data-testid="picture"
          classList={{ still: !!still(), zoomed: zoom().k > 1 }}
        />
        <Show
          when={
            still() ||
            (live() &&
              frameSize() &&
              (camera.range() || camera.torch() !== null))
          }
        >
          <div
            class="zoom-controls"
            role="group"
            aria-label={still() ? 'Zoom' : 'Camera'}
          >
            <Show when={!still() && camera.torch() !== null}>
              <button
                aria-label="Torch"
                aria-pressed={!!camera.torch()}
                onClick={camera.toggleTorch}
              >
                {ICONS.torch()}
              </button>
            </Show>
            <Show when={still() || camera.range()}>
              <button
                aria-label="Zoom in"
                disabled={!canZoomIn()}
                onClick={() => zoomViewBy(1.5)}
              >
                {ICONS.plus()}
              </button>
              <button
                aria-label="Reset zoom"
                disabled={!canZoomOut()}
                onClick={resetZoom}
              >
                {formatZoom(zoomLevel())}
              </button>
              <button
                aria-label="Zoom out"
                disabled={!canZoomOut()}
                onClick={() => zoomViewBy(1 / 1.5)}
              >
                {ICONS.minus()}
              </button>
            </Show>
          </div>
        </Show>
        <Show when={view().kind === 'live' && !frameSize()}>
          <div class="empty">
            <Show
              when={cameraError()}
              fallback={<p class="starting">Starting camera…</p>}
            >
              {ICONS.cameraOff()}
              <h2>Camera unavailable</h2>
              <p role="status">{cameraError()}</p>
              <div class="actions">
                <button class="primary" onClick={() => startCamera()}>
                  Try Again
                </button>
                <button onClick={() => fileInput.click()}>Upload Image</button>
                <button onClick={showExample}>Try Example Image</button>
              </div>
            </Show>
          </div>
        </Show>
        <div class="notices">
          <Show when={finding() && !results()}>
            <div class="find" role="search">
              <input
                ref={findInput}
                value={findText()}
                aria-label="Tags to find"
                aria-invalid={sought().invalid}
                placeholder="IDs to find, e.g. 3, 7-9"
                autocomplete="off"
                spellcheck={false}
                enterkeyhint="done"
                onInput={(e) => setFindText(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    e.currentTarget.blur();
                  }
                }}
                onBlur={() => {
                  if (!findText().trim()) closeFind();
                }}
              />
              <button aria-label="Stop finding tags" onClick={closeFind}>
                {ICONS.close()}
              </button>
            </div>
          </Show>
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
              data-found-tag-ids={ids().filter(isSought).join(',')}
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

/** Shows a menu item's keyboard shortcut, on devices likely to have a keyboard. */
function Shortcut(props: { key: string }) {
  return <kbd aria-hidden="true">{props.key}</kbd>;
}

/**
 * Parses IDs and ranges of IDs, such as "3, 7-9". Skips entries that aren't
 * IDs in a family of `familySize` tags, and says whether there were any.
 */
export function parseIdRanges(
  text: string,
  familySize: number
): { ranges: [number, number][]; invalid: boolean } {
  const ranges: [number, number][] = [];
  let invalid = false;
  for (const entry of text.replace(/\s*-\s*/g, '-').split(/[\s,]+/)) {
    if (!entry) continue;
    const match = /^(\d+)(?:-(\d+))?$/.exec(entry);
    const first = Number(match?.[1]);
    const last = Number(match?.[2] ?? first);
    if (match && first <= last && last < familySize) ranges.push([first, last]);
    else invalid = true;
  }
  return { ranges, invalid };
}

/** e.g. 2.5×. */
function formatZoom(k: number): string {
  return `${k < 10 ? Number(k.toFixed(1)) : Math.round(k)}×`;
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
  // Feather's camera-off (MIT licence).
  cameraOff: icon(() => (
    <path
      d="M1 1l22 22M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  )),
  // Feather's zap (MIT licence).
  torch: icon(() => (
    <path
      d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />
  )),
  plus: icon(() => (
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  )),
  minus: icon(() => (
    <path
      d="M5 12h14"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
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
