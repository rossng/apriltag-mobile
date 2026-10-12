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
import { detect, FAMILIES, findDuplicateIds, type Detection } from './detector';
import { drawOverlay, pixels } from './canvas';

type View =
  | { kind: 'live' }
  | { kind: 'paused' | 'image'; image: ImageData }
  | { kind: 'recording'; seen: Set<number> }
  | { kind: 'results'; ids: number[] };

type Size = { width: number; height: number };

const FAMILY_KEY = 'selectedFamily';
const DUPLICATES_KEY = 'detectDuplicates';
const EXAMPLE = { url: 'sample.jpg', family: 'tagStandard52h13' };

export function App() {
  const [view, setView] = createSignal<View>({ kind: 'live' });
  const saved = localStorage.getItem(FAMILY_KEY) ?? '';
  const [family, setFamily] = createSignal(
    saved in FAMILIES ? saved : 'tag36h11'
  );
  const [recordMode, setRecordMode] = createSignal(false);
  const [detectDuplicates, setDetectDuplicates] = createSignal(
    localStorage.getItem(DUPLICATES_KEY) === 'true'
  );
  const [cover, setCover] = createSignal(true);
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
  const busy = () => view().kind === 'recording' || view().kind === 'results';
  const detections = createMemo(() => {
    const image = still();
    return image ? detect(image, family()) : liveDetections();
  });
  const ids = () =>
    detections()
      .map((d) => d.id)
      .sort((a, b) => a - b);
  const recorded = () => {
    const v = view();
    return v.kind === 'results' ? v.ids : undefined;
  };
  const duplicates = () =>
    detectDuplicates() && !recorded() ? findDuplicateIds(detections()) : [];

  createEffect(() => localStorage.setItem(FAMILY_KEY, family()));
  createEffect(() =>
    localStorage.setItem(DUPLICATES_KEY, String(detectDuplicates()))
  );

  createEffect(() => {
    cover(); // The label size depends on object-fit.
    const image = still();
    const size = image ?? frameSize() ?? { width: 0, height: 0 };
    drawOverlay(canvas, detections(), duplicates(), size, image);
  });

  /** Feeds every new camera frame to the detector while in a live view. */
  function watchFrames() {
    video.cancelVideoFrameCallback(frameCallback);
    const onFrame = () => {
      const { videoWidth: width, videoHeight: height } = video;
      setFrameSize({ width, height });
      const v = view();
      if (v.kind === 'live' || v.kind === 'recording') {
        const found = detect(pixels(video, width, height), family());
        setLiveDetections(found);
        if (v.kind === 'recording') for (const { id } of found) v.seen.add(id);
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

  async function showImage(blob: Blob | Promise<Blob>, newFamily?: string) {
    try {
      const bitmap = await createImageBitmap(await blob);
      const image = pixels(bitmap, bitmap.width, bitmap.height);
      batch(() => {
        setView({ kind: 'image', image });
        if (newFamily) setFamily(newFamily);
        setStatus('');
      });
    } catch {
      setStatus('Failed to load image');
    }
  }

  function goLive() {
    setLiveDetections([]);
    setView({ kind: 'live' });
  }

  function stopRecording() {
    const v = view();
    if (v.kind !== 'recording') return;
    setView({ kind: 'results', ids: [...v.seen].sort((a, b) => a - b) });
  }

  const button = createMemo(() => {
    switch (view().kind) {
      case 'image':
        return { label: 'Close image', icon: ICONS.close, action: goLive };
      case 'paused':
        return { label: 'Resume', icon: ICONS.play, action: goLive };
      case 'recording':
        return {
          label: 'Stop recording',
          icon: ICONS.stop,
          action: stopRecording,
        };
    }
    const disabled = view().kind === 'results' || !frameSize();
    return recordMode()
      ? {
          label: 'Start recording',
          icon: ICONS.record,
          disabled,
          action: () => setView({ kind: 'recording', seen: new Set<number>() }),
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
        <h1>AprilTag Detector</h1>
        <select
          aria-label="Tag family"
          disabled={busy()}
          title={busy() ? 'Family selection is disabled while recording' : ''}
          onChange={(e) => setFamily(e.currentTarget.value)}
        >
          <For each={Object.entries(FAMILIES)}>
            {([id, count]) => (
              <option value={id} selected={id === family()}>
                {id} ({count} tags)
              </option>
            )}
          </For>
        </select>
        <button
          class="menu-button"
          popovertarget="menu"
          aria-label="More options"
        >
          {ICONS.more()}
        </button>
        <div ref={menu} id="menu" popover role="menu" aria-label="More options">
          <button
            role="menuitemcheckbox"
            aria-checked={recordMode()}
            onClick={() => {
              setRecordMode(!recordMode());
              if (!recordMode()) stopRecording();
            }}
          >
            Record Mode
          </button>
          <button
            role="menuitemcheckbox"
            aria-checked={cover()}
            disabled={view().kind === 'image' || view().kind === 'results'}
            title="Fill the screen with the camera view, cropping its edges"
            onClick={() => setCover(!cover())}
          >
            Cover Mode
          </button>
          <button
            role="menuitemcheckbox"
            aria-checked={detectDuplicates()}
            title="Warn when the same tag ID appears more than once"
            onClick={() => setDetectDuplicates(!detectDuplicates())}
          >
            Detect Duplicates
          </button>
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
            Select Image
          </button>
          <button
            role="menuitem"
            disabled={busy()}
            onClick={closeMenuThen(() =>
              showImage(
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

      <main classList={{ cover: cover() && view().kind !== 'image' }}>
        <video ref={video} autoplay muted playsinline />
        <canvas ref={canvas} classList={{ still: !!still() }} />
        <div class="notices">
          <p role="status">{status()}</p>
          <Show when={duplicates().length}>
            <p role="alert">
              Duplicate marker{duplicates().length > 1 ? 's' : ''}:{' '}
              {duplicates().join(', ')}
            </p>
          </Show>
        </div>
        <Show
          when={recorded()}
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
          {(ids) => <Results ids={ids()} onClose={goLive} />}
        </Show>
      </main>

      <footer>
        <button
          class="capture"
          aria-label={button().label}
          disabled={button().disabled}
          onClick={() => button().action()}
        >
          {button().icon()}
        </button>
      </footer>

      {/* The about panel is static content in index.html. */}
      <button class="about" popovertarget="about" aria-label="About">
        {ICONS.about()}
      </button>
    </>
  );
}

function Results(props: { ids: number[]; onClose: () => void }) {
  return (
    <section class="results">
      <h2>Recorded Tags</h2>
      <Show
        when={props.ids.length}
        fallback={<p>No tags detected during recording</p>}
      >
        <p>
          {props.ids.length} unique tag{props.ids.length === 1 ? '' : 's'}{' '}
          detected
        </p>
        <ul role="list" aria-label="Recorded tags">
          <For each={idRanges(props.ids)}>
            {(entry) => (
              <li classList={{ range: entry.includes('-') }}>{entry}</li>
            )}
          </For>
        </ul>
      </Show>
      <button
        class="close"
        aria-label="Close recorded tags"
        onClick={props.onClose}
      >
        ×
      </button>
    </section>
  );
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
  <svg viewBox="0 0 24 24">{content()}</svg>
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
  pause: icon(() => (
    <>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </>
  )),
  record: icon(() => <circle cx="12" cy="12" r="8" fill="red" />),
  stop: icon(() => <rect x="6" y="6" width="12" height="12" rx="2" />),
  more: icon(() => (
    <>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </>
  )),
  about: icon(() => (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
  )),
};
