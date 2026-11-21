import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/browser",
	workers: 1,
	timeout: 30000,
	projects: process.env.PREVIEW_URL
		? [{ name: "preview" }]
		: [{ name: "preview" }, { name: "production" }],
	use: {
		browserName: "chromium",
		launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
			? {
					executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
					args: ["--no-sandbox"],
				}
			: {},
		screenshot: "only-on-failure",
	},
});
