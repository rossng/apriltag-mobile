import { createResource } from 'solid-js';
import { renderTag } from './detector';

interface Glyph {
  size: number;
  dark: string;
  light: string;
}

const glyphs = new Map<string, Promise<Glyph>>();

/** A tag as one path per colour. */
function glyph([family, id]: [string, number]): Promise<Glyph> {
  const key = `${family}:${id}`;
  let glyph = glyphs.get(key);
  if (!glyph) {
    glyph = renderTag(family, id).then(({ size, cells }) => {
      let dark = '';
      let light = '';
      cells.forEach((cell, i) => {
        const square = `M${i % size} ${Math.floor(i / size)}h1v1h-1z`;
        if (cell === 0) dark += square;
        else if (cell === 255) light += square;
      });
      return { size, dark, light };
    });
    glyphs.set(key, glyph);
  }
  return glyph;
}

/**
 * Draws a tag, once the detector has rendered it. With a `label`, it's an
 * image of that name; otherwise it's decoration.
 */
export function TagGlyph(props: {
  family: string;
  id: number;
  label?: string;
}) {
  const [shape] = createResource(
    () => [props.family, props.id] as [string, number],
    glyph
  );
  // latest keeps showing the previous tag while the next loads.
  const size = () => shape.latest?.size ?? 1;
  return (
    <svg
      class="tag-glyph"
      viewBox={`0 0 ${size()} ${size()}`}
      shape-rendering="crispEdges"
      role={props.label ? 'img' : undefined}
      aria-label={props.label}
      aria-hidden={props.label ? undefined : 'true'}
      aria-busy={shape.loading}
    >
      <path class="dark" d={shape.latest?.dark} />
      <path class="light" d={shape.latest?.light} />
    </svg>
  );
}
