import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures.mjs";

const publicPages = ["/", "/now/", "/about/", "/projects/", "/journal/"];
const contentPages = ["/projects/test-project/", "/journal/test-article/"];

for (const width of [375, 768, 1280, 1440]) {
	test(`navigation, layout, images and accessibility at ${width}px`, async ({
		page,
	}, testInfo) => {
		await page.setViewportSize({ width, height: 1000 });
		const errors = [];
		page.on("pageerror", (error) => errors.push(error.message));
		const paths =
			testInfo.project.name === "production"
				? [...publicPages, ...contentPages]
				: publicPages;
		for (const path of paths) {
			const response = await page.goto(path);
			expect(response.status()).toBe(200);
			await expect(page.locator("h1")).toHaveCount(1);
			await page.evaluate(() => document.fonts.ready);
			if (path === "/")
				await page.screenshot({
					path: testInfo.outputPath("home.png"),
					fullPage: true,
				});
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= window.innerWidth,
				),
			).toBe(true);
			for (const image of await page.locator("img").all()) {
				await image.scrollIntoViewIfNeeded();
				await expect(image).toHaveJSProperty("complete", true);
				expect(await image.evaluate((img) => img.naturalWidth)).toBeGreaterThan(
					0,
				);
			}
			const results = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
				.analyze();
			expect(
				results.violations.map(({ id, nodes }) => ({
					id,
					nodes: nodes.map(({ target, failureSummary }) => ({
						target,
						failureSummary,
					})),
				})),
				path,
			).toEqual([]);
		}
		await page.goto("/");
		await page.keyboard.press("Tab");
		await expect(
			page.getByRole("link", { name: "Skip to content" }),
		).toBeFocused();
		await page
			.getByRole("navigation", { name: "Main navigation" })
			.getByRole("link", { name: "Contact", exact: true })
			.click();
		await expect(page).toHaveURL(/\/about\/#contact$/);
		await expect(
			page.getByRole("link", { name: "Find me on GitHub" }),
		).toHaveAttribute("href", "https://github.com/RikardEkstam");
		expect(errors).toEqual([]);
	});
}

test("preview explains design examples and restores keyboard focus", async ({
	page,
}, testInfo) => {
	test.skip(testInfo.project.name !== "preview");
	await page.goto("/");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex, nofollow",
	);
	await page
		.getByRole("link", { name: "Explore projects", exact: true })
		.click();
	await expect(page).toHaveURL(/#projects$/);
	const example = page.getByRole("button", { name: /Network Garden/ });
	await example.click();
	await expect(page.getByRole("dialog")).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).not.toBeVisible();
	await expect(example).toBeFocused();
});

test("production links the project log and article and copies code", async ({
	page,
	context,
}, testInfo) => {
	test.skip(testInfo.project.name !== "production");
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"index, follow",
	);
	await expect(page.getByText("Network Garden")).toHaveCount(0);
	await page.getByRole("link", { name: /Published test update/ }).click();
	await expect(page).toHaveURL(
		/\/projects\/test-project\/#update-test-update$/,
	);
	await expect(page.locator("#update-test-update")).toContainText(
		"Update body marker.",
	);
	await page.getByRole("link", { name: /Published test article/ }).click();
	const toc = page.getByRole("navigation", { name: "Table of contents" });
	await toc.getByRole("link", { name: "Working code" }).click();
	await expect(page).toHaveURL(/\/journal\/test-article\/#working-code$/);
	await expect(
		page.getByRole("heading", { name: "Working code" }),
	).toBeVisible();
	const copy = page.getByRole("button", { name: "Copy code" });
	await copy.click();
	await expect(copy).toHaveText("Copied");
	expect(
		(await page.evaluate(() => navigator.clipboard.readText())).trim(),
	).toBe("const answer = 42;");
	await page.getByRole("link", { name: /Explore the related project/ }).click();
	await expect(
		page.getByRole("heading", { name: "Published test project", level: 1 }),
	).toBeVisible();
});
