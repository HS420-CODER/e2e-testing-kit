# /test - Run E2E Tests

Run E2E tests and generate reports.

## Usage

```
/test              # Run all tests
/test --pdf        # Run tests + PDF report
/test --report     # Run tests + Allure report
/test login        # Run tests matching "login"
```

## Instructions

When user invokes this command:

1. Check if dependencies are installed:
   ```bash
   npm list @playwright/test
   ```

2. If not installed, run:
   ```bash
   npm install -D @playwright/test allure-playwright allure-commandline pdfkit
   npx playwright install
   ```

3. Run the appropriate command based on args:
   - Default: `npm run test:e2e`
   - With `--pdf`: `npm run test:e2e && npm run report:pdf`
   - With `--report`: `npm run test:e2e && npm run allure:report`
   - With pattern: `npx playwright test -g "pattern"`

4. Report results to user with pass/fail summary.
