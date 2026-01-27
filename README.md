# E2E Testing Kit

A reusable end-to-end testing kit with Playwright, Allure reports, and PDF export.

[![Playwright](https://img.shields.io/badge/Playwright-1.58-green)](https://playwright.dev/)
[![Allure](https://img.shields.io/badge/Allure-Report-orange)](https://allurereport.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Installation

**One command to add E2E testing to any project:**

```bash
npx degit HS420-CODER/e2e-testing-kit e2e-testing
```

Then install dependencies:

```bash
npm install -D @playwright/test allure-playwright allure-commandline pdfkit
npx playwright install
```

## Features

- **Playwright** - Fast, reliable E2E testing
- **Allure Reports** - Beautiful interactive HTML reports
- **PDF Export** - Professional PDF reports with screenshots
- **Multi-browser** - Chrome, Firefox, Safari, Mobile
- **Easy Setup** - One command to add to any project

## Quick Start

### Option 1: Copy to New Project

```bash
# Copy the testing-kit folder to your project
cp -r testing-kit your-project/

# Navigate to your project
cd your-project

# Install dependencies
npm install -D @playwright/test allure-playwright allure-commandline pdfkit

# Install browsers
npx playwright install
```

### Option 2: Use Setup Script

```bash
# From your project directory
node /path/to/testing-kit/scripts/setup.cjs .

# Then install dependencies
npm install -D @playwright/test allure-playwright allure-commandline pdfkit
npx playwright install
```

## Configuration

Edit `playwright.config.ts` to set your base URL:

```typescript
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
```

Or use environment variable:

```bash
BASE_URL=http://localhost:8080 npm run test:e2e
```

## Writing Tests

Create test files in `e2e/` directory:

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:ui` | Run tests with UI mode |
| `npm run test:e2e:headed` | Run tests with visible browser |
| `npm run test:chromium` | Run tests on Chrome only |
| `npm run test:firefox` | Run tests on Firefox only |
| `npm run test:webkit` | Run tests on Safari only |
| `npm run allure:report` | Generate & open Allure HTML report |
| `npm run allure:serve` | Serve Allure report directly |
| `npm run report:pdf` | Generate PDF report |
| `npm run test:report` | Run tests + generate all reports |
| `npm run clean` | Remove all report artifacts |

## Reports

### Allure HTML Report

Interactive web-based report with:
- Test results dashboard
- Screenshots and videos
- Execution timeline
- Failure details
- History trends

```bash
npm run allure:report
```

### PDF Report

Professional PDF export with:
- Summary statistics
- Pass/fail badges
- Embedded screenshots
- Test duration

```bash
npm run report:pdf
```

Customize with environment variables:

```bash
REPORT_TITLE="My App Tests" OUTPUT_FILE="my-report.pdf" npm run report:pdf
```

## Directory Structure

```
your-project/
├── e2e/                    # Test files
│   ├── example.spec.ts
│   └── your-tests.spec.ts
├── specs/                  # Test plans (optional)
├── scripts/
│   └── generate-pdf-report.cjs
├── playwright.config.ts
├── allure-results/         # (generated)
├── allure-report/          # (generated)
├── playwright-report/      # (generated)
└── test-report.pdf         # (generated)
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Generate Allure report
        if: always()
        run: npm run allure:generate

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-report
          path: allure-report/
```

## Troubleshooting

### Tests not finding elements

Use Playwright's built-in locators:

```typescript
// Prefer role-based locators
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email')
page.getByPlaceholder('Enter email')
page.getByText('Welcome')
```

### Flaky tests

Add explicit waits:

```typescript
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible({ timeout: 10000 });
```

### PDF report error: "EBUSY"

Close the PDF file before regenerating.

## License

MIT
