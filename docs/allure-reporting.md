# Allure Reporting Guide

> Source: [Allure Documentation](https://docs.qameta.io/allure/)

Allure is a flexible, lightweight test reporting tool that provides clear and comprehensive test reports.

## Setup (Already Configured)

This testing kit comes with Allure pre-configured in `playwright.config.ts`:

```typescript
reporter: [
  ['list'],
  ['allure-playwright', { outputFolder: 'allure-results' }],
]
```

## Generating Reports

```bash
# Run tests (generates allure-results/)
npm run test:e2e

# Generate HTML report
npm run allure:report

# Or generate and serve directly
npx allure serve allure-results
```

## Adding Metadata to Tests

### Test Descriptions

```typescript
import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

test('user login', async ({ page }) => {
  await allure.description('Verifies that users can log in with valid credentials');
  await allure.severity('critical');

  // test implementation
});
```

### Severity Levels

```typescript
import * as allure from 'allure-js-commons';

test('critical feature', async ({ page }) => {
  await allure.severity('critical');  // blocker, critical, normal, minor, trivial
});
```

### Labels and Tags

```typescript
test('checkout flow', async ({ page }) => {
  await allure.epic('E-Commerce');
  await allure.feature('Checkout');
  await allure.story('Payment Processing');
  await allure.tag('smoke');
  await allure.tag('regression');
});
```

### Steps

Break tests into readable steps:

```typescript
import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

test('complete purchase', async ({ page }) => {
  await allure.step('Navigate to store', async () => {
    await page.goto('/store');
  });

  await allure.step('Add item to cart', async () => {
    await page.getByRole('button', { name: 'Add to Cart' }).click();
  });

  await allure.step('Proceed to checkout', async () => {
    await page.getByRole('link', { name: 'Checkout' }).click();
  });

  await allure.step('Complete payment', async () => {
    await page.getByLabel('Card Number').fill('4111111111111111');
    await page.getByRole('button', { name: 'Pay' }).click();
  });
});
```

### Attachments

```typescript
import * as allure from 'allure-js-commons';

test('with attachments', async ({ page }) => {
  // Attach screenshot
  const screenshot = await page.screenshot();
  await allure.attachment('Screenshot', screenshot, 'image/png');

  // Attach text
  await allure.attachment('API Response', JSON.stringify(response), 'application/json');

  // Attach HTML
  const html = await page.content();
  await allure.attachment('Page HTML', html, 'text/html');
});
```

### Links

```typescript
test('linked test', async ({ page }) => {
  await allure.link('https://github.com/issue/123', 'GitHub Issue');
  await allure.issue('JIRA-456', 'https://jira.example.com/JIRA-456');
  await allure.tms('TC-001', 'https://testmanagement.example.com/TC-001');
});
```

## Report Features

### Dashboard
- Overview of test execution
- Pass/fail statistics
- Duration trends
- Categories breakdown

### Suites View
- Hierarchical test organization
- Test grouping by file/describe blocks

### Timeline View
- Parallel execution visualization
- Test duration comparison

### Behaviors View
- Tests organized by Epic > Feature > Story
- BDD-style reporting

### Categories
Automatic categorization of failures:
- Product defects
- Test defects
- Broken tests

## Commands Reference

```bash
# Generate report from results
npx allure generate allure-results --clean -o allure-report

# Open generated report
npx allure open allure-report

# Serve results directly (temp report)
npx allure serve allure-results

# This kit's shortcuts
npm run allure:report     # Generate and open
npm run report:pdf        # Generate PDF report
npm run test:report       # Run tests + all reports
```

## Best Practices

1. **Use meaningful test names** - They appear in the report
2. **Add severity labels** - Helps prioritize failures
3. **Use steps for complex tests** - Makes reports readable
4. **Attach evidence** - Screenshots, API responses, logs
5. **Link to issues** - Connect failures to bug tracking
6. **Clean results before runs** - Avoid stale data mixing

```bash
# Clean before running
npm run clean && npm run test:e2e
```

## References

- [Allure Framework Documentation](https://docs.qameta.io/allure/)
- [Allure Playwright Integration](https://www.npmjs.com/package/allure-playwright)
- [Allure Report Features](https://docs.qameta.io/allure/#_report_structure)
