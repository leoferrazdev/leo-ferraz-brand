import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://leoferraz.dev',
  base: '/',
  output: 'static',
  outDir: './dist',
  build: {
    format: 'directory',
  },
  trailingSlash: 'always',
});
