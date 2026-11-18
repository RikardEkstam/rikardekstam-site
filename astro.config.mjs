import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://rikardekstam-site.vercel.app';
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark' } },
});
