import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publishedContent, updateUrl } from '../lib/content';
export async function GET(context: APIContext) {
  const { journal, updates } = await publishedContent();
  return rss({ title: 'Rikard Ekstam — In progress', description: 'Technical notes and project updates from the workbench.', site: context.site!, items: [...journal.map(p => ({ title: p.data.title, description: p.data.description, pubDate: p.data.date, link: `/journal/${p.id}/` })), ...updates.map(p => ({ title: p.data.title, description: p.data.description, pubDate: p.data.date, link: updateUrl(p.id, p.data.project.id) }))].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()), customData: '<language>en</language>' });
}
