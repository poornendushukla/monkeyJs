import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  experimental: {
    contentIntellisense: true,
  },
  integrations: [
    mdx(),
    react(),
    tailwind({
      nesting: true,
    }),
  ],
});
