import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],

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
