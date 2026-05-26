import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative paths so the built bundle works whether the app is served from
  // the root or from a subpath like /repo-name/ (GitHub Pages).
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
