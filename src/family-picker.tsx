import { createSignal, For, onCleanup, onMount } from 'solid-js';
import { FAMILIES } from './detector';
import { TagGlyph } from './tag-glyph';

const NAMES = Object.keys(FAMILIES);
const LIST_ID = 'family-list';
const optionId = (i: number) => `family-option-${i}`;

/**
 * Picks a tag family, showing an example tag from each. Follows the ARIA
 * select-only combobox pattern: focus stays on the button, which points at
 * the highlighted option with aria-activedescendant.
 */
export function FamilyPicker(props: {
  value: string;
  disabled: boolean;
  title: string;
  onChange: (family: string) => void;
}) {
  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(0);
  let trigger!: HTMLButtonElement;
  let list!: HTMLDivElement;

  function show() {
    // The list is in the top layer, so place it under the button by hand.
    const box = trigger.getBoundingClientRect();
    const width = Math.min(380, innerWidth - 24);
    const left = Math.min(
      Math.max(12, box.right - width),
      innerWidth - 12 - width
    );
    Object.assign(list.style, {
      top: `${box.bottom + 6}px`,
      left: `${left}px`,
      width: `${width}px`,
      maxHeight: `${innerHeight - box.bottom - 18}px`,
    });
    list.showPopover();
    setOpen(true);
    highlight(NAMES.indexOf(props.value));
  }

  function hide() {
    if (!open()) return;
    list.hidePopover();
    setOpen(false);
  }

  function highlight(i: number) {
    setActive(i);
    document.getElementById(optionId(i))?.scrollIntoView({ block: 'nearest' });
  }

  function choose(i: number) {
    props.onChange(NAMES[i]);
    hide();
  }

  function onKeyDown(e: KeyboardEvent) {
    const last = NAMES.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active() + 1, last),
      ArrowUp: Math.max(active() - 1, 0),
      Home: 0,
      End: last,
    };
    if (!open()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        show();
      }
    } else if (e.key in moves) {
      e.preventDefault();
      highlight(moves[e.key]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(active());
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault();
      hide();
    }
  }

  onMount(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!trigger.contains(target) && !list.contains(target)) hide();
    };
    document.addEventListener('pointerdown', onPointerDown);
    addEventListener('resize', hide);
    onCleanup(() => {
      document.removeEventListener('pointerdown', onPointerDown);
      removeEventListener('resize', hide);
    });
  });

  return (
    <>
      <button
        ref={trigger}
        class="family-trigger"
        role="combobox"
        aria-label="Tag family"
        aria-haspopup="listbox"
        aria-controls={LIST_ID}
        aria-expanded={open()}
        aria-activedescendant={open() ? optionId(active()) : undefined}
        disabled={props.disabled}
        title={props.title}
        onClick={() => (open() ? hide() : show())}
        onKeyDown={onKeyDown}
      >
        <TagGlyph family={props.value} id={0} />
        <span class="name">{props.value}</span>{' '}
        <span class="count">{tagCount(props.value)}</span>
      </button>
      <div
        ref={list}
        id={LIST_ID}
        popover="manual"
        role="listbox"
        aria-label="Tag family"
        // Keep focus on the button when clicking an option.
        onMouseDown={(e) => e.preventDefault()}
      >
        <For each={NAMES}>
          {(name, i) => (
            <div
              id={optionId(i())}
              role="option"
              aria-selected={name === props.value}
              classList={{ active: open() && active() === i() }}
              onPointerMove={() => setActive(i())}
              onClick={() => choose(i())}
            >
              <TagGlyph family={name} id={0} />
              <span class="name">{name}</span>{' '}
              <span class="count">{tagCount(name)}</span>
            </div>
          )}
        </For>
      </div>
    </>
  );
}

function tagCount(family: string): string {
  return `${FAMILIES[family].toLocaleString('en')} tags`;
}
