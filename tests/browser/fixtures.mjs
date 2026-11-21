import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { test as base } from "@playwright/test";
import { addPublishedContent, withSiteFixture } from "../site-fixture.mjs";

// A short-lived static test fixture. It serves the exact build output and is
// closed with the test worker; it is not the user-facing development preview.
export const test = base.extend({
	fixtureURL: [
		// biome-ignore lint/correctness/noEmptyPattern: Playwright requires fixture argument destructuring.
		async ({}, use, workerInfo) => {
			if (process.env.PREVIEW_URL) return use(process.env.PREVIEW_URL);
			await withSiteFixture(async ({ dist, put, build }) => {
				const production = workerInfo.project.name === "production";
				if (production) await addPublishedContent(put);
				await build({ SITE_INDEXABLE: String(production) });
				await serve(dist, use);
			});
		},
		{ scope: "worker", timeout: 60000 },
	],
	baseURL: async ({ fixtureURL }, use) => use(fixtureURL),
});

async function serve(root, use) {
	const mime = {
		".html": "text/html",
		".css": "text/css",
		".js": "text/javascript",
		".woff2": "font/woff2",
		".woff": "font/woff",
		".png": "image/png",
		".jpg": "image/jpeg",
		".webp": "image/webp",
		".svg": "image/svg+xml",
		".xml": "application/xml",
		".txt": "text/plain",
	};
	const server = createServer(async (request, response) => {
		try {
			const pathname = decodeURIComponent(
				new URL(request.url, "http://localhost").pathname,
			);
			let path = resolve(root, `.${pathname}`);
			if (path !== root && !path.startsWith(root + sep)) {
				response.writeHead(403).end();
				return;
			}
			if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
			const body = await readFile(path);
			response
				.writeHead(200, {
					"Content-Type": mime[extname(path)] || "application/octet-stream",
				})
				.end(body);
		} catch {
			response
				.writeHead(404, { "Content-Type": "text/html" })
				.end(await readFile(resolve(root, "404.html")));
		}
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	try {
		await use(`http://127.0.0.1:${server.address().port}`);
	} finally {
		await new Promise((resolve) => server.close(resolve));
	}
}

export { expect } from "@playwright/test";
