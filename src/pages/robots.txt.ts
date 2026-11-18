import type { APIContext } from 'astro';
import { site } from '../config';
export function GET(context: APIContext) {
  return new Response(`User-agent: *\nAllow: /\n${site.indexable ? `Sitemap: ${new URL('sitemap-index.xml', context.site)}\n` : '# Temporary edition: pages carry noindex metadata.\n'}`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
