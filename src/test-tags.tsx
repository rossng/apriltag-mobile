// A page of tags to point the app at, e.g. shown on a laptop while testing on
// a phone. Its settings live in the URL, so a page of tags can be reloaded or
// shared.

import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { render } from 'solid-js/web';
import { FAMILIES } from './detector';
import { TagGlyph } from './tag-glyph';
import { idRanges, parseIdRanges } from './tag-ids';
import './test-tags.css';

const NAMES = Object.keys(FAMILIES);

/** Each tag's edge length in CSS pixels, including its white border. */
const SIZE = { min: 24, max: 600, initial: 120 };

/** Enough to fill a large screen with small tags. */
const MAX_TAGS = 500;

/** The space between tags as a fraction of their size. */
const GAP = 0.25;
const PADDING = 24;

function TestTags() {
  const params = new URLSearchParams(location.search);
  const [family, setFamily] = createSignal(
    NAMES.find((name) => name === params.get('family')) ?? 'tag36h11'
  );
  const [size, setSize] = createSignal(
    clamp(Number(params.get('size')) || SIZE.initial, SIZE.min, SIZE.max)
  );
  /** The IDs to show, as typed, e.g. "0-11, 20". */
  const [idsText, setIdsText] = createSignal(params.get('ids') ?? '');
  const [labels, setLabels] = createSignal(params.get('labels') !== '0');
  const [controls, setControls] = createSignal(true);
  const [fullscreen, setFullscreen] = createSignal(false);

  const parsed = createMemo(() => parseIdRanges(idsText(), FAMILIES[family()]));
  /** The IDs in the order typed, repeats included, to test duplicates. */
  const ids = createMemo(() => {
    const ids: number[] = [];
    for (const [first, last] of parsed().ranges) {
      for (let id = first; id <= last && ids.length < MAX_TAGS; id++) {
        ids.push(id);
      }
    }
    return ids;
  });
  const labelSize = () => clamp(size() * 0.12, 10, 20);

  createEffect(() => {
    const query = new URLSearchParams({
      family: family(),
      size: String(size()),
      ids: idsText(),
    });
    if (!labels()) query.set('labels', '0');
    history.replaceState(null, '', `?${query}`);
  });

  /** How many tags of the current size fit on the screen. */
  function fitCount(): number {
    const gap = size() * GAP;
    const label = labels() ? labelSize() * 1.2 + 4 : 0;
    const across = (innerWidth - 2 * PADDING + gap) / (size() + gap);
    const down = (innerHeight - 2 * PADDING + gap) / (size() + label + gap);
    return Math.max(1, Math.floor(across) * Math.floor(down));
  }

  /** Fills the screen with different tags, chosen at random. */
  function randomIds() {
    const count = FAMILIES[family()];
    const chosen = new Set<number>();
    const wanted = Math.min(fitCount(), count, MAX_TAGS);
    while (chosen.size < wanted) chosen.add(randomInt(0, count - 1));
    setIdsText(idRanges([...chosen].sort((a, b) => a - b)).join(', '));
  }

  function chooseFamily(name: string) {
    setFamily(name);
    // Rather than an empty page, show tags that the family has.
    if (parsed().invalid || !ids().length) randomIds();
  }

  function randomFamily() {
    const others = NAMES.filter((name) => name !== family());
    chooseFamily(others[randomInt(0, others.length - 1)]);
  }

  function randomSize() {
    const largest = Math.min(300, Math.min(innerWidth, innerHeight) / 2);
    setSize(randomInt(40, Math.max(40, Math.floor(largest))));
  }

  function randomAll() {
    randomFamily();
    randomSize();
    randomIds();
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }

  onMount(() => {
    if (!idsText()) randomIds();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setControls(true);
    };
    const onFullscreen = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFullscreen);
    onCleanup(() => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullscreen);
    });
  });

  return (
    <>
      <Show when={controls()}>
        <header>
          <div class="field">
            <label for="family">Family</label>
            <select
              id="family"
              onChange={(e) => chooseFamily(e.currentTarget.value)}
            >
              <For each={NAMES}>
                {(name) => (
                  <option value={name} selected={name === family()}>
                    {name}
                  </option>
                )}
              </For>
            </select>
            <Dice label="Random family" onClick={randomFamily} />
          </div>
          <div class="field">
            <label for="size">Size</label>
            <input
              id="size"
              type="range"
              min={SIZE.min}
              max={SIZE.max}
              value={size()}
              onInput={(e) => setSize(Number(e.currentTarget.value))}
            />
            <output for="size">{size()} px</output>
            <Dice label="Random size" onClick={randomSize} />
          </div>
          <div class="field ids">
            <label for="ids">IDs</label>
            <input
              id="ids"
              value={idsText()}
              aria-invalid={parsed().invalid}
              placeholder="e.g. 0-11, 20"
              autocomplete="off"
              spellcheck={false}
              onInput={(e) => setIdsText(e.currentTarget.value)}
            />
            <Dice label="Random IDs" onClick={randomIds} />
          </div>
          <label class="field">
            <input
              type="checkbox"
              checked={labels()}
              onChange={(e) => setLabels(e.currentTarget.checked)}
            />
            Show IDs
          </label>
          <span class="count">
            {ids().length} tag{ids().length === 1 ? '' : 's'}
          </span>
          <div class="actions">
            <button onClick={randomAll}>Randomise All</button>
            <Show when={document.fullscreenEnabled}>
              <button onClick={toggleFullscreen}>
                {fullscreen() ? 'Exit Full Screen' : 'Full Screen'}
              </button>
            </Show>
            <button
              title="Click the tags or press Esc to show them again"
              onClick={() => setControls(false)}
            >
              Hide Controls
            </button>
          </div>
        </header>
      </Show>
      <main onClick={() => setControls(true)}>
        <ul
          aria-label="Tags"
          style={{
            gap: `${size() * GAP}px`,
            padding: `${PADDING}px`,
            '--tag-size': `${size()}px`,
            '--label-size': `${labelSize()}px`,
          }}
        >
          <For each={ids()}>
            {(id) => (
              <li>
                <TagGlyph family={family()} id={id} label={`Tag ${id}`} />
                <Show when={labels()}>
                  <span aria-hidden="true">{id}</span>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </main>
    </>
  );
}

function Dice(props: { label: string; onClick: () => void }) {
  return (
    <button
      class="dice"
      aria-label={props.label}
      title={props.label}
      onClick={props.onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="15.5" cy="15.5" r="1.5" />
      </svg>
    </button>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** A whole number from `min` to `max` inclusive. */
function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

render(() => <TestTags />, document.getElementById('app')!);
