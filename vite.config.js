import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solid(),
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
  },
});
