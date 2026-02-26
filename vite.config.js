import { defineConfig } from 'vite';

export default defineConfig({
  // Base URL - use VITE_BASE_PATH for custom deployments (e.g. PR previews),
  // './' for production GitHub Pages, '/' for local dev
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? './' : '/'),
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    // Enable HTTPS for camera access during development
    https: false // Set to true if needed for camera testing
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'esnext',
    // Ensure WASM files are copied to the output
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      external: ['/apriltag_wasm.js'],
      output: {
        format: 'es'
      }
    }
  },
  
  // Ensure WASM files are treated as assets
  assetsInclude: ['**/*.wasm'],
  
  // Development optimizations
  optimizeDeps: {
    exclude: ['apriltag_wasm.js', 'apriltag_wasm.wasm']
  }
});