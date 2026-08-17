import { defineConfig, fontProviders } from 'astro/config';

const typographyReviewDevOnly = {
  name: 'typography-review-dev-only',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev') {
        injectRoute({
          pattern: '/brand/review/typography/',
          entrypoint: './src/review/typography.astro',
        });
        injectRoute({
          pattern: '/brand/review/signature/',
          entrypoint: './src/review/signature.astro',
        });
      }
    },
  },
};

export default defineConfig({
  site: 'https://leoferraz.dev',
  base: '/',
  output: 'static',
  outDir: './dist',
  build: {
    format: 'directory',
  },
  trailingSlash: 'always',
  integrations: [typographyReviewDevOnly],
  fonts: [
    {
      // The variable Fontsource package declares this exact internal family name.
      name: 'IBM Plex Sans Variable',
      cssVariable: '--font-ibm-plex-sans',
      provider: fontProviders.npm({ remote: false }),
      weights: ['100 700'],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      fallbacks: ['sans-serif'],
      options: {
        package: '@fontsource-variable/ibm-plex-sans',
        file: 'index.css',
      },
    },
    {
      name: 'IBM Plex Mono',
      cssVariable: '--font-ibm-plex-mono',
      provider: fontProviders.npm({ remote: false }),
      weights: [500],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      fallbacks: ['monospace'],
      options: {
        package: '@fontsource/ibm-plex-mono',
        file: '500.css',
      },
    },
  ],
});
