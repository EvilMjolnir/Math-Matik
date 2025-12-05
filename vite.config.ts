import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  }
});