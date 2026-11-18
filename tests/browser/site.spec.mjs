import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [375, 768, 1280, 1440]) {
  test(`navigation, layout, images and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of ['/', '/now/', '/about/', '/projects/', '/journal/']) {
      const response = await page.goto(path);
      expect(response.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await page.evaluate(() => document.fonts.ready);
      if (path === '/') await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty('complete', true);
        expect(await image.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
      }
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations).toEqual([]);
    }
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.getByRole('link', { name: 'Explore projects', exact: true }).click();
    await expect(page).toHaveURL(/#projects$/);
    await page.getByRole('button', { name: /Network Garden/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/#contact$/);
    await expect(page.getByRole('link', { name: 'Find me on GitHub' })).toHaveAttribute('href', 'https://github.com/RikardEkstam');
    expect(errors).toEqual([]);
  });
}
