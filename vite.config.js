import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

/** Files from public/ that the app needs offline. */
const OFFLINE_PUBLIC_FILES = [
  'favicon.svg',
  'manifest.webmanifest',
  'sample.jpg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
];

/**
 * Emits a service worker that caches the built app, so it works offline once
 * visited. Its version changes whenever the app's files do.
 */
function serviceWorker() {
  return {
    name: 'service-worker',
    apply: 'build',
    generateBundle(_, bundle) {
      const files = ['./', ...Object.keys(bundle), ...OFFLINE_PUBLIC_FILES];
      const version = createHash('sha256')
        .update(files.join('\n'))
        .digest('hex')
        .slice(0, 12);
      const source = readFileSync('src/service-worker.js', 'utf8')
        .replace("'__VERSION__'", JSON.stringify(version))
        .replace('__PRECACHE__', JSON.stringify(files));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  plugins: [
    solid(),
    serviceWorker(),
    {
      // Keeps PR previews out of search results; set by pr-preview.yml.
      name: 'noindex',
      transformIndexHtml: () =>
        process.env.VITE_NOINDEX
          ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } }]
          : [],
    },
  ],

  // Base URL - use VITE_BASE_PATH for custom deployments (e.g. PR previews),
  // './' for production GitHub Pages, '/' for local dev
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? './' : '/'),

  server: {
    port: 3000,
    open: true,
  },

  build: {
    target: 'esnext',
    rollupOptions: {
      // test-tags/ isn't linked from the app: it shows tags to test it with.
      input: ['index.html', 'test-tags/index.html'],
    },
  },

  // The detector runs in a module worker.
  worker: {
    format: 'es',
  },
});
