import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  experimental: {
    contentIntellisense: true,
  },
  vite: {
    plugins: [tailwind()],
  },
  integrations: [mdx(), react()],
});
