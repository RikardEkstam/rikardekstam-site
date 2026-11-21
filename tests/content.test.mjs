import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { addPublishedContent, withSiteFixture } from "./site-fixture.mjs";

test("design preview is labelled, unindexed and excluded from published feeds", async () =>
	withSiteFixture(async ({ dist, build }) => {
		await build();
		const readBuilt = (path) => readFile(join(dist, path), "utf8");
		const html = await readBuilt("index.html");
		assert.match(html, /I BUILD/);
		assert.match(html, /name="robots" content="noindex, nofollow"/);
		assert.doesNotMatch(html, /href="\/journal\/"/);
		assert.doesNotMatch(html, /href="\/projects\/"/);
		assert.match(html, /DESIGN PREVIEW/);
		assert.match(html, /Network Garden/);
		assert.match(html, /illustrative examples/);
		assert.doesNotMatch(await readBuilt("rss.xml"), /<item>/);
		await access(join(dist, "images/social.png"));
	}));

test("published MDX, related updates, RSS and draft exclusion work end to end", async () =>
	withSiteFixture(async ({ dist, put, build }) => {
		const read = (path) => readFile(join(dist, path), "utf8");
		await addPublishedContent(put);
		await put(
			"projects",
			"private-project.md",
			"---\ntitle: Secret project marker\ndescription: Not published\nstatus: exploring\n---\nDraft.",
		);
		await put(
			"journal",
			"private-article.md",
			"---\ntitle: Secret article marker\ndescription: Not published\ndate: 2026-01-02\ndraft: true\n---\nDraft.",
		);
		await put(
			"journal",
			"private-dependent.md",
			"---\ntitle: Secret dependent marker\ndescription: Not published\ndate: 2026-01-03\ndraft: false\nproject: private-project\n---\nDraft project.",
		);
		await put(
			"updates",
			"private-update.md",
			"---\ntitle: Secret update marker\ndescription: Not published\ndate: 2026-01-05\ndraft: false\nproject: private-project\n---\nDraft project.",
		);
		await build();
		const home = await read("index.html");
		assert.match(home, /Published test project/);
		assert.match(home, /Published test article/);
		assert.match(home, /Published test update/);
		const article = await read("journal/test-article/index.html");
		assert.match(article, /href="#working-code"/);
		assert.match(article, /data-mdx-test="yes"/);
		assert.match(article, /astro-code/);
		assert.match(
			await read("projects/test-project/index.html"),
			/id="update-test-update"/,
		);
		assert.match(
			await read("projects/test-project/index.html"),
			/Update body marker/,
		);
		const feed = await read("rss.xml");
		assert.equal((feed.match(/<item>/g) || []).length, 2);
		assert.match(
			feed,
			/https:\/\/test.example\/projects\/test-project\/#update-test-update/,
		);
		const sitemap = await read("sitemap-0.xml");
		for (const document of [home, article, feed, sitemap])
			assert.doesNotMatch(
				document,
				/Secret |private-project|private-article|private-dependent|private-update/,
			);
		for (const path of [
			"projects/private-project/index.html",
			"journal/private-article/index.html",
			"journal/private-dependent/index.html",
		])
			await assert.rejects(access(join(dist, path)));
		await build({
			SITE_URL: "https://rikardekstam.com",
			SITE_INDEXABLE: "true",
		});
		assert.match(
			await read("index.html"),
			/name="robots" content="index, follow"/,
		);
		assert.doesNotMatch(
			await read("index.html"),
			/Network Garden|Starforge|DESIGN PREVIEW/,
		);
		assert.match(
			await read("journal/test-article/index.html"),
			/rel="canonical" href="https:\/\/rikardekstam.com\/journal\/test-article\/"/,
		);
		assert.match(
			await read("robots.txt"),
			/Sitemap: https:\/\/rikardekstam.com\/sitemap-index.xml/,
		);
		await put(
			"updates",
			"broken-update.md",
			"---\ntitle: Broken\ndescription: Invalid reference\ndate: 2026-01-01\ndraft: false\nproject: missing-project\n---\nBroken.",
		);
		await assert.rejects(build(), (error) => error.code === 1);
	}));
