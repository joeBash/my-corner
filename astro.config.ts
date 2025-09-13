import { defineConfig } from 'astro/config';

/* ------------------------------ Integrations ------------------------------ */
import icon from 'astro-icon';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
/* -------------------------------------------------------------------------- */

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.joebashour.dev',
  base: '/',
  integrations: [icon(), svelte(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },
});
