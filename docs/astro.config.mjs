import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://poornendushukla.github.io',
  base: '/',
  experimental: {
    contentIntellisense: true,
  },
  vite: {
    plugins: [tailwind()],
  },
  integrations: [mdx(), react()],
});
