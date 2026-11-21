import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, "..");
const content = join(root, "src", "content");

export async function withSiteFixture(use) {
	// Stay under the repository so Node can resolve its installed dependencies.
	const dir = await mkdtemp(join(root, ".test-site-"));
	try {
		for (const file of [
			"src",
			"public",
			"astro.config.mjs",
			"tsconfig.json",
			"package.json",
		]) {
			await cp(join(root, file), join(dir, file), {
				recursive: true,
				filter: (source) => source !== content,
			});
		}
		for (const collection of ["projects", "journal", "updates"]) {
			await mkdir(join(dir, "src", "content", collection), { recursive: true });
		}
		const put = (folder, name, text) =>
			writeFile(join(dir, "src", "content", folder, name), text);
		const build = (env = {}) =>
			exec(
				process.execPath,
				[join(root, "node_modules", "astro", "bin", "astro.mjs"), "build"],
				{
					cwd: dir,
					env: {
						...process.env,
						ASTRO_TELEMETRY_DISABLED: "1",
						SITE_URL: "https://test.example",
						SITE_INDEXABLE: "false",
						DESIGN_PREVIEW: "true",
						...env,
					},
				},
			);
		await use({ dist: join(dir, "dist"), put, build });
	} finally {
		await rm(dir, { recursive: true, force: true, maxRetries: 3 });
	}
}

export async function addPublishedContent(put) {
	await put(
		"projects",
		"test-project.md",
		"---\ntitle: Published test project\ndescription: A test project\nstatus: building\nfeatured: true\ndraft: false\nimage: /images/workspace.jpg\nimageAlt: Plants and a laptop in a bright workspace\n---\n## The idea\nA published project.",
	);
	await put(
		"journal",
		"test-article.mdx",
		'---\ntitle: Published test article\ndescription: Article description\ndate: 2026-01-01\ndraft: false\nproject: test-project\n---\n## Working code\n\n```ts\nconst answer = 42;\n```\n\n<div data-mdx-test="yes">An MDX component</div>',
	);
	await put(
		"updates",
		"test-update.md",
		"---\ntitle: Published test update\ndescription: Update description\ndate: 2026-01-04\ndraft: false\nproject: test-project\n---\nUpdate body marker.",
	);
}
