import { test, expect } from '@playwright/test';

/**
 * External Site Testing - No Source Code Required!
 *
 * This example shows how to test ANY website using just its URL.
 * Simply change the URLs to test your own sites.
 *
 * Usage:
 *   BASE_URL=https://your-site.com npm run test:e2e
 */

test.describe('External Site Tests', () => {

  // Add delay between tests to avoid rate limiting
  test.afterEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test('TC-001: Homepage loads successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await expect(page).toHaveTitle(/.+/); // Has any title
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-002: Page has no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors.length).toBe(0);
  });

  test('TC-003: Page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Under 5 seconds
  });

  test('TC-004: All images load correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = await page.locator('img').all();
    for (const img of images) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('TC-005: No broken links on page', async ({ page }) => {
    await page.goto('/');

    const links = await page.locator('a[href^="http"]').all();
    const brokenLinks: string[] = [];

    for (const link of links.slice(0, 10)) { // Check first 10 links
      const href = await link.getAttribute('href');
      if (href) {
        try {
          const response = await page.request.get(href);
          if (response.status() >= 400) {
            brokenLinks.push(`${href} (${response.status()})`);
          }
        } catch (e) {
          brokenLinks.push(`${href} (failed)`);
        }
      }
    }

    expect(brokenLinks).toEqual([]);
  });

  test('TC-006: Page is mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check no horizontal scrollbar
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // Allow small margin
  });

  test('TC-007: Page has meta description', async ({ page }) => {
    await page.goto('/');

    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(10);
  });

});

/**
 * Example: Testing specific URLs directly
 * Uncomment and modify these for your use case
 */

// test('Test Google', async ({ page }) => {
//   await page.goto('https://www.google.com');
//   await expect(page).toHaveTitle(/Google/);
//   await page.fill('input[name="q"]', 'Playwright');
//   await page.press('input[name="q"]', 'Enter');
//   await expect(page.locator('#search')).toBeVisible();
// });

// test('Test GitHub', async ({ page }) => {
//   await page.goto('https://github.com');
//   await expect(page).toHaveTitle(/GitHub/);
//   await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
// });
