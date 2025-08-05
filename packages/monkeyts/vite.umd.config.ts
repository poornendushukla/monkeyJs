import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'MonkeyJS',
      // Force .js extension for UMD
      fileName: (format) => format === 'umd' ? 'monkeyts.umd.js' : `monkeyts.${format}.js`,
      formats: ['umd'],
    },
    outDir: '../../docs/public/demo',
    emptyOutDir: false,
  }
});

