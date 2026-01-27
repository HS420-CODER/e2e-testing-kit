# CLAUDE.md - E2E Testing Kit

This file provides guidance to Claude Code for working with this E2E testing kit.

## Project Overview

Reusable E2E testing kit with:
- **Playwright** - Browser automation & testing
- **Allure** - Interactive HTML reports
- **PDF Export** - Professional PDF reports with screenshots

## Commands

```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Interactive UI mode
npm run test:e2e:headed   # Run with visible browser
npm run allure:report     # Generate & open HTML report
npm run report:pdf        # Generate PDF report
npm run test:report       # Run tests + all reports
npm run clean             # Remove all artifacts
```

## File Structure

```
e2e/                      # Test files (*.spec.ts)
scripts/
  generate-pdf-report.cjs # PDF report generator
  setup.cjs               # Project setup helper
specs/                    # Test plans (markdown)
playwright.config.ts      # Playwright configuration
```

## Writing Tests

Tests go in `e2e/` directory:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test('TC-001: should work', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/App/);
  });
});
```

## Configuration

Edit `playwright.config.ts`:
- `BASE_URL` - Your app's URL (default: http://localhost:3000)
- `testDir` - Test directory (default: ./e2e)
- `projects` - Browsers to test

## PDF Report Naming

Reports are automatically named based on the site, tested page/suite, and report type:
- Format: `{site-name}-{page-name}-{report-type}.pdf`
- Example: `localhost-external-site-tests-e2e-report.pdf`

The site name is extracted from BASE_URL, and the page name from Allure results (describe block or test file).

Override with environment variables:
```bash
# Test against a specific site
BASE_URL=https://example.com npm run test:e2e
npm run report:pdf
# Output: example-com-external-site-tests-e2e-report.pdf

# Custom naming
SITE_NAME=prod PAGE_NAME=login REPORT_TYPE=smoke-test npm run report:pdf
# Output: prod-login-smoke-test.pdf

OUTPUT_FILE=custom-report.pdf npm run report:pdf
# Output: custom-report.pdf
```

## When User Asks to Test

1. Check if dependencies installed: `npm list @playwright/test`
2. If not, install: `npm install -D @playwright/test allure-playwright allure-commandline pdfkit && npx playwright install`
3. Run tests: `npm run test:e2e`
4. Generate reports as requested

## When User Asks to Create Tests

1. Analyze the target page/feature
2. Create test file in `e2e/` with `.spec.ts` extension
3. Use Playwright best practices (role-based locators)
4. Include positive, negative, and edge cases
5. Run tests to verify they pass
