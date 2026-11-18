import { defineConfig } from '@playwright/test';

if (!process.env.PREVIEW_URL) throw new Error('Set PREVIEW_URL to the running site URL.');
export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: process.env.PREVIEW_URL,
    browserName: 'chromium',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ['--no-sandbox'] } : {},
    screenshot: 'only-on-failure',
  },
});
