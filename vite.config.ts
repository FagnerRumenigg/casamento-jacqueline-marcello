import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/casamento-jacqueline-marcello/',
  build: {
    sourcemap: false,
    minify: 'oxc',
    reportCompressedSize: false,
    cssMinify: true,
    target: 'es2020',
    chunkSizeWarningLimit: 700,
  },
});
