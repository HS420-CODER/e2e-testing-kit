# Playwright Configuration Guide

> Source: [Playwright Official Documentation](https://playwright.dev/docs/test-configuration)

## Configuration File

Playwright uses `playwright.config.ts` for configuration:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './e2e',

  // Parallel execution
  fullyParallel: true,

  // Fail build if test.only is left in code
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Number of parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],

  // Shared settings for all projects
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

## Key Configuration Options

### Timeouts

```typescript
export default defineConfig({
  // Global timeout for each test
  timeout: 30000, // 30 seconds

  // Timeout for expect() assertions
  expect: {
    timeout: 5000, // 5 seconds
  },

  use: {
    // Action timeout (click, fill, etc.)
    actionTimeout: 10000,

    // Navigation timeout
    navigationTimeout: 30000,
  },
});
```

### Screenshots and Videos

```typescript
use: {
  // Screenshot options: 'off', 'on', 'only-on-failure'
  screenshot: 'only-on-failure',

  // Video options: 'off', 'on', 'retain-on-failure', 'on-first-retry'
  video: 'retain-on-failure',

  // Trace options: 'off', 'on', 'retain-on-failure', 'on-first-retry'
  trace: 'on-first-retry',
}
```

### Viewport and Device Emulation

```typescript
use: {
  // Custom viewport
  viewport: { width: 1280, height: 720 },

  // Or use device presets
  ...devices['iPhone 13'],
  ...devices['Pixel 5'],
}
```

### Browser Projects

```typescript
projects: [
  // Desktop browsers
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },

  // Mobile browsers
  {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 5'] },
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 12'] },
  },

  // Branded browsers
  {
    name: 'Microsoft Edge',
    use: { ...devices['Desktop Edge'], channel: 'msedge' },
  },
  {
    name: 'Google Chrome',
    use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  },
]
```

## Reporters

### Built-in Reporters

```typescript
reporter: [
  // Console output
  ['list'],                    // Simple list
  ['line'],                    // Single line per test
  ['dot'],                     // Dot per test

  // HTML report
  ['html', { outputFolder: 'playwright-report', open: 'never' }],

  // JSON report
  ['json', { outputFile: 'results.json' }],

  // JUnit (for CI)
  ['junit', { outputFile: 'results.xml' }],
]
```

### Allure Reporter (this kit)

```typescript
reporter: [
  ['list'],
  ['allure-playwright', { outputFolder: 'allure-results' }],
]
```

## Environment Variables

```typescript
// Use environment variables
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  use: {
    baseURL: BASE_URL,
  },
});
```

Run with environment variables:

```bash
BASE_URL=https://staging.example.com npx playwright test
```

## Web Server

Auto-start your dev server before tests:

```typescript
export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test login.spec.ts

# Run tests with specific title
npx playwright test -g "login"

# Run in specific browser
npx playwright test --project=chromium

# Run in headed mode
npx playwright test --headed

# Run with UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Run specific test by line
npx playwright test login.spec.ts:10
```

## Debugging

### UI Mode

```bash
npx playwright test --ui
```

### Trace Viewer

```bash
npx playwright show-trace trace.zip
```

### VS Code Extension

Install "Playwright Test for VS Code" for:
- Run/debug tests from editor
- Pick locators from browser
- Watch mode

## References

- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Reporters](https://playwright.dev/docs/test-reporters)
- [Command Line](https://playwright.dev/docs/test-cli)
