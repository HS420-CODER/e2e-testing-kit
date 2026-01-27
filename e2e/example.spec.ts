import { test, expect } from '@playwright/test';

/**
 * Example E2E Test Suite
 *
 * Replace this with your actual tests.
 * Delete this file after adding your own tests.
 */

test.describe('Example Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to base URL before each test
    await page.goto('/');
  });

  test('TC-001: Page loads successfully', async ({ page }) => {
    // Verify page is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-002: Page has correct title', async ({ page }) => {
    // Replace with your expected title
    await expect(page).toHaveTitle(/.+/);
  });

  test('TC-003: Main content is visible', async ({ page }) => {
    // Replace 'main' with your main content selector
    const mainContent = page.locator('main, #root, #app, body');
    await expect(mainContent.first()).toBeVisible();
  });
});

test.describe('Responsive Tests', () => {
  test('TC-004: Mobile viewport works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-005: Tablet viewport works', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
