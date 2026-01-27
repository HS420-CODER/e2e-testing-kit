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
- **Claude Code Ready** - Built-in AI integration
- **Easy Setup** - One command to add to any project

## Playwright vs This Kit

This kit **is** Playwright - with extras pre-configured.

| Feature | Playwright (Raw) | E2E Testing Kit |
|---------|------------------|-----------------|
| Test runner | Yes | Yes (same) |
| Browser automation | Yes | Yes (same) |
| HTML report | Basic | Allure (richer) |
| PDF reports | No | Yes |
| Pre-configured | No | Yes |
| Allure integration | Manual setup | Ready to use |
| Example tests | No | Yes |
| Documentation | External | Included |

**Use raw Playwright** when you want minimal setup and full control.

**Use this kit** when you need professional reports (Allure + PDF), faster setup, or are testing external sites.

---

## 🤖 Using with Claude Code

This kit is designed to work seamlessly with [Claude Code](https://claude.ai/code).

### Step 1: Add to Your Project

Open Claude Code in your project and say:

```
Add E2E testing to this project using the testing kit from github.com/HS420-CODER/e2e-testing-kit
```

Or manually:

```bash
npx degit HS420-CODER/e2e-testing-kit e2e-testing
npm install -D @playwright/test allure-playwright allure-commandline pdfkit
npx playwright install
```

### Step 2: Talk to Claude Code

Just ask naturally! Here are example prompts:

| What You Want | What to Say |
|---------------|-------------|
| Run tests | *"Run the E2E tests"* |
| See results | *"Show me the test results"* |
| HTML report | *"Generate an Allure report"* |
| PDF report | *"Create a PDF test report"* |
| Write tests | *"Create E2E tests for the login page"* |
| Test specific feature | *"Write tests for the shopping cart"* |
| Debug failures | *"Why is the checkout test failing?"* |
| Add more tests | *"Add tests for form validation"* |

### Step 3: Example Conversations

**Creating Tests:**
```
You: Create E2E tests for the user registration page at /signup

Claude: I'll create comprehensive tests for the registration page...
        [Creates e2e/registration.spec.ts with multiple test cases]
```

**Running Tests:**
```
You: Run the tests and show me the results

Claude: Running E2E tests...
        ✓ 12 passed (15.2s)

        All tests passed! Would you like me to generate a report?
```

**Generating Reports:**
```
You: Generate a PDF report for the stakeholders

Claude: Generating PDF report...
        ✅ PDF Report generated: test-report.pdf

        📊 Summary:
           Total Tests: 12
           Passed: 12
           Pass Rate: 100%
```

### Step 4: Advanced Usage

**Test specific browsers:**
```
Run tests only on Chrome and Firefox
```

**Test specific features:**
```
Run only the tests that contain "login" in their name
```

**Generate all reports:**
```
Run tests and generate both HTML and PDF reports
```

**Debug mode:**
```
Run the failing test in debug mode so I can see what's happening
```

### Included Claude Code Files

```
.claude/
├── agents/
│   └── test-generator.md    # AI agent for writing tests
└── commands/
    └── test.md              # Test command definition

CLAUDE.md                    # Instructions for Claude Code
```

---

## Quick Start

### Option 1: Using degit (Recommended)

```bash
# Download the kit into your project
npx degit HS420-CODER/e2e-testing-kit e2e-testing

# Install dependencies
npm install -D @playwright/test allure-playwright allure-commandline pdfkit

# Install browsers
npx playwright install

# Run your first test
npm run test:e2e
```

### Option 2: Clone Repository

```bash
# Clone the repo
git clone https://github.com/HS420-CODER/e2e-testing-kit.git

# Copy to your project
cp -r e2e-testing-kit/* your-project/

# Install dependencies
cd your-project
npm install -D @playwright/test allure-playwright allure-commandline pdfkit
npx playwright install
```

### Option 3: Use Setup Script

```bash
# Download and run setup in one command
curl -sL https://raw.githubusercontent.com/HS420-CODER/e2e-testing-kit/master/scripts/setup.cjs | node - .

# Install dependencies
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

### 🌐 No Source Code Required!

You can test **any website** using just its URL. No access to source code needed!

```bash
# Test any production site
BASE_URL=https://your-app.com npm run test:e2e

# Test staging environment
BASE_URL=https://staging.example.com npm run test:e2e

# Test any public website
BASE_URL=https://google.com npm run test:e2e
```

**Use cases:**
- ✅ Test production deployments
- ✅ Monitor external services
- ✅ QA third-party integrations
- ✅ Verify competitor features
- ✅ Check site uptime & performance

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

## Documentation

Best practices and guides from official sources:

| Guide | Description |
|-------|-------------|
| [Playwright Best Practices](docs/playwright-best-practices.md) | Locators, assertions, test isolation |
| [Page Object Model](docs/page-object-model.md) | POM pattern with examples |
| [Writing Tests](docs/writing-tests.md) | Test structure, hooks, naming conventions |
| [Configuration](docs/configuration.md) | Playwright config, reporters, debugging |
| [Allure Reporting](docs/allure-reporting.md) | Metadata, steps, attachments |

## Directory Structure

```
your-project/
├── e2e/                    # Test files
│   ├── example.spec.ts
│   └── your-tests.spec.ts
├── docs/                   # Best practices & guides
│   ├── playwright-best-practices.md
│   ├── page-object-model.md
│   ├── writing-tests.md
│   ├── configuration.md
│   └── allure-reporting.md
├── specs/                  # Test plans (optional)
├── scripts/
│   └── generate-pdf-report.cjs
├── playwright.config.ts
├── allure-results/         # (generated)
├── allure-report/          # (generated)
├── playwright-report/      # (generated)
└── *-e2e-report.pdf        # (generated)
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
