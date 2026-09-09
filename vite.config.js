import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
  test: {
    include: ['tests/**/*.test.{js,mjs}'],
    testTimeout: 90_000,
    hookTimeout: 90_000,
  },
});
