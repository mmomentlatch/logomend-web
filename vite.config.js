import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

function copyFfmpegCore() {
  return {
    name: 'copy-ffmpeg-core',
    closeBundle() {
      const target = resolve('dist/ffmpeg-core');
      mkdirSync(target, { recursive: true });
      for (const file of ['ffmpeg-core.js', 'ffmpeg-core.wasm']) {
        copyFileSync(resolve('node_modules/@ffmpeg/core/dist/esm', file), resolve(target, file));
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [copyFfmpegCore()],
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      input: {
        uk: resolve('index.html'),
        en: resolve('en/index.html'),
        pl: resolve('pl/index.html'),
        de: resolve('de/index.html'),
      },
    },
  },
});
