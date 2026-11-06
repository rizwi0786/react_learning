import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the build works from any folder (file server, artifact host, GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react()],
});
