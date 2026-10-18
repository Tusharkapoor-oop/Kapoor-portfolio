import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works both at '/' and under '/Kapoor-portfolio/'.
export default defineConfig({
  base: './',
  plugins: [react()],
  // Only index.html is our entry — keep the untracked Tusharkapoor-oop/ project out of dep scanning.
  optimizeDeps: {
    entries: ['index.html'],
  },
  server: {
    watch: {
      ignored: ['**/Tusharkapoor-oop/**'],
    },
  },
});
