// Runs the WebAssembly detector off the main thread. See detector.ts.

import createModule from './apriltag/apriltag_wasm.js';
import type {
  Detection,
  DetectorMessage,
  DetectorRequest,
  DetectorResponse,
  TagPattern,
} from './detector';

/** Numbers per detection in the results buffer; see wasm/apriltag_wasm.c. */
const STRIDE = 11;

// Load the module without top-level await, so that requests sent while it
// loads aren't dropped before the message handler is installed.
const ready = createModule();

self.onmessage = async ({ data }: MessageEvent<DetectorMessage>) => {
  const wasm = await ready;
  let response: DetectorResponse;
  try {
    response = {
      id: data.id,
      result: data.kind === 'detect' ? detect(data) : renderTag(data),
    };
  } catch (e) {
    response = { id: data.id, error: String(e) };
  }
  self.postMessage(response);

  function detect({
    image,
    family,
    bits,
    quadDecimate,
  }: Extract<DetectorRequest, { kind: 'detect' }>): Detection[] {
    // Only reconfigures the detector when the family or bits change.
    const status = wasm.ccall(
      'atag_set_family',
      'number',
      ['string', 'number'],
      [family, bits]
    );
    if (status !== 0) throw new Error(`Unsupported: ${family}, ${bits} bits`);

    // Each call can grow WASM memory, which replaces the HEAP* views, so only
    // read them afterwards.
    const imagePtr = wasm._atag_image(image.width, image.height);
    wasm.HEAPU8.set(image.data, imagePtr);
    const count = wasm._atag_detect(image.width, image.height, quadDecimate);
    const start = wasm._atag_results() / Float64Array.BYTES_PER_ELEMENT;
    const r = wasm.HEAPF64.subarray(start, start + count * STRIDE);

    return Array.from({ length: count }, (_, i) => {
      const at = (j: number) => r[i * STRIDE + j];
      return {
        id: at(0),
        center: { x: at(1), y: at(2) },
        corners: [0, 1, 2, 3].map((c) => ({
          x: at(3 + 2 * c),
          y: at(4 + 2 * c),
        })),
      };
    });
  }

  function renderTag({
    family,
    tag,
  }: Extract<DetectorRequest, { kind: 'render' }>): TagPattern {
    const size = wasm.ccall(
      'atag_render',
      'number',
      ['string', 'number'],
      [family, tag]
    );
    if (size < 0) throw new Error(`Unknown tag: ${family} #${tag}`);
    // Same size again, so this returns the buffer without changing it.
    const ptr = wasm._atag_image(size, size);
    return { size, cells: wasm.HEAPU8.slice(ptr, ptr + size * size) };
  }
};
