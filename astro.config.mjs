// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['lucide-react', 'gsap'],
    },
  },
  adapter: vercel(),
  integrations: [
    react(),
    {
      name: 'isolated-vite-cache',
      hooks: {
        'astro:config:setup': ({ command, updateConfig }) => {
          // Astro also creates Vite dev servers during builds; use Astro's command.
          updateConfig({ vite: { cacheDir: `node_modules/.vite/astro-${command}` } });
        },
      },
    },
  ],
});
