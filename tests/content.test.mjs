import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, symlink, writeFile, readFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);

const root = resolve(import.meta.dirname, '..');
const readBuilt = path => readFile(join(root, 'dist', path), 'utf8');

test('design preview is labelled, unindexed and excluded from published feeds', async () => {
  const html = await readBuilt('index.html');
  assert.match(html, /I BUILD/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(html, /href="\/journal\/"/);
  assert.doesNotMatch(html, /href="\/projects\/"/);
  assert.match(html, /DESIGN PREVIEW/);
  assert.match(html, /Network Garden/);
  assert.match(html, /illustrative examples/);
  assert.doesNotMatch(await readBuilt('rss.xml'), /<item>/);
  await access(join(root, 'dist/images/social.png'));
});

test('published MDX, related updates, RSS and draft exclusion work end to end', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rikard-content-'));
  const build = (extraEnv = {}) => exec(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], { cwd: dir, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', SITE_URL: 'https://test.example', SITE_INDEXABLE: 'false', ...extraEnv }, encoding: 'utf8', stdio: 'pipe' });
  const put = (folder, name, text) => writeFile(join(dir, 'src/content', folder, name), text);
  const read = path => readFile(join(dir, 'dist', path), 'utf8');
  try {
    for (const file of ['src', 'public', 'astro.config.mjs', 'tsconfig.json', 'package.json']) await cp(join(root, file), join(dir, file), { recursive: true });
    await symlink(join(root, 'node_modules'), join(dir, 'node_modules'), 'dir');
    await put('projects', 'test-project.md', '---\ntitle: Published test project\ndescription: A test project\nstatus: building\nfeatured: true\ndraft: false\n---\n## The idea\nA published project.');
    await put('projects', 'private-project.md', '---\ntitle: Secret project marker\ndescription: Not published\nstatus: exploring\n---\nDraft.');
    await put('journal', 'test-article.mdx', '---\ntitle: Published test article\ndescription: Article description\ndate: 2026-01-01\ndraft: false\nproject: test-project\n---\n## Working code\n\n```ts\nconst answer = 42;\n```\n\n<div data-mdx-test="yes">An MDX component</div>');
    await put('journal', 'private-article.md', '---\ntitle: Secret article marker\ndescription: Not published\ndate: 2026-01-02\ndraft: true\n---\nDraft.');
    await put('journal', 'private-dependent.md', '---\ntitle: Secret dependent marker\ndescription: Not published\ndate: 2026-01-03\ndraft: false\nproject: private-project\n---\nDraft project.');
    await put('updates', 'test-update.md', '---\ntitle: Published test update\ndescription: Update description\ndate: 2026-01-04\ndraft: false\nproject: test-project\n---\nUpdate body marker.');
    await put('updates', 'private-update.md', '---\ntitle: Secret update marker\ndescription: Not published\ndate: 2026-01-05\ndraft: false\nproject: private-project\n---\nDraft project.');
    await build();
    const home = await read('index.html');
    assert.match(home, /Published test project/);
    assert.match(home, /Published test article/);
    assert.match(home, /Published test update/);
    const article = await read('journal/test-article/index.html');
    assert.match(article, /href="#working-code"/);
    assert.match(article, /data-mdx-test="yes"/);
    assert.match(article, /astro-code/);
    assert.match(await read('projects/test-project/index.html'), /id="update-test-update"/);
    assert.match(await read('projects/test-project/index.html'), /Update body marker/);
    const feed = await read('rss.xml');
    assert.equal((feed.match(/<item>/g) || []).length, 2);
    assert.match(feed, /https:\/\/test.example\/projects\/test-project\/#update-test-update/);
    const sitemap = await read('sitemap-0.xml');
    for (const document of [home, article, feed, sitemap]) assert.doesNotMatch(document, /Secret |private-project|private-article|private-dependent|private-update/);
    for (const path of ['projects/private-project/index.html', 'journal/private-article/index.html', 'journal/private-dependent/index.html']) await assert.rejects(access(join(dir, 'dist', path)));
    await build({ SITE_URL: 'https://rikardekstam.com', SITE_INDEXABLE: 'true' });
    assert.match(await read('index.html'), /name="robots" content="index, follow"/);
    assert.doesNotMatch(await read('index.html'), /Network Garden|Starforge|DESIGN PREVIEW/);
    assert.match(await read('journal/test-article/index.html'), /rel="canonical" href="https:\/\/rikardekstam.com\/journal\/test-article\/"/);
    assert.match(await read('robots.txt'), /Sitemap: https:\/\/rikardekstam.com\/sitemap-index.xml/);
    await put('updates', 'broken-update.md', '---\ntitle: Broken\ndescription: Invalid reference\ndate: 2026-01-01\ndraft: false\nproject: missing-project\n---\nBroken.');
    await assert.rejects(build(), error => error.code === 1);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
