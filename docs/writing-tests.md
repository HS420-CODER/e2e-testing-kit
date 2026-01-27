# Writing Effective E2E Tests

> Source: [Playwright Official Documentation](https://playwright.dev/docs/writing-tests)

## Test Structure

### Basic Test

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

### Grouped Tests with describe

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('login with valid credentials', async ({ page }) => {
    // test implementation
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    // test implementation
  });

  test('logout clears session', async ({ page }) => {
    // test implementation
  });
});
```

## Test Hooks

### beforeEach / afterEach

Run before/after each test:

```typescript
test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the store before each test
    await page.goto('/store');
  });

  test.afterEach(async ({ page }) => {
    // Clear cart after each test
    await page.evaluate(() => localStorage.clear());
  });

  test('add item to cart', async ({ page }) => {
    // test starts at /store
  });
});
```

### beforeAll / afterAll

Run once per worker (before/after all tests in a file):

```typescript
test.describe('Database Tests', () => {
  test.beforeAll(async () => {
    // Setup: seed database
    console.log('Setting up test data');
  });

  test.afterAll(async () => {
    // Cleanup: clear test data
    console.log('Cleaning up');
  });
});
```

## Test Naming Conventions

Use descriptive names that explain the expected behavior:

```typescript
// GOOD: Descriptive names
test('user can add product to cart', async ({ page }) => {});
test('checkout requires login for guest users', async ({ page }) => {});
test('search returns relevant results for keyword', async ({ page }) => {});

// BAD: Vague names
test('test1', async ({ page }) => {});
test('cart test', async ({ page }) => {});
```

### Test ID Convention

Use consistent test IDs for traceability:

```typescript
test('TC-001: Homepage loads successfully', async ({ page }) => {});
test('TC-002: Navigation menu displays all links', async ({ page }) => {});
test('TC-003: Search returns results', async ({ page }) => {});
```

## Actions

### Navigation

```typescript
// Go to URL
await page.goto('/login');
await page.goto('https://example.com');

// Wait for navigation
await page.goto('/dashboard', { waitUntil: 'networkidle' });

// Go back/forward
await page.goBack();
await page.goForward();

// Reload
await page.reload();
```

### Interactions

```typescript
// Click
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByText('Learn more').click();

// Fill input
await page.getByLabel('Email').fill('user@example.com');

// Type (with delay, simulates real typing)
await page.getByLabel('Search').pressSequentially('playwright', { delay: 100 });

// Select dropdown
await page.getByLabel('Country').selectOption('USA');

// Check/uncheck
await page.getByLabel('Remember me').check();
await page.getByLabel('Newsletter').uncheck();

// Hover
await page.getByText('Menu').hover();

// Press key
await page.getByLabel('Search').press('Enter');
```

## Assertions

### Page Assertions

```typescript
// Title
await expect(page).toHaveTitle('Dashboard');
await expect(page).toHaveTitle(/Dashboard/);

// URL
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/\/dashboard/);
```

### Element Assertions

```typescript
const button = page.getByRole('button', { name: 'Submit' });

// Visibility
await expect(button).toBeVisible();
await expect(button).toBeHidden();

// State
await expect(button).toBeEnabled();
await expect(button).toBeDisabled();

// Text
await expect(button).toHaveText('Submit');
await expect(button).toContainText('Sub');

// Attributes
await expect(button).toHaveAttribute('type', 'submit');
await expect(button).toHaveClass(/primary/);

// Count
await expect(page.getByRole('listitem')).toHaveCount(3);
```

## Soft Assertions

Continue test execution even if assertion fails:

```typescript
test('page has correct elements', async ({ page }) => {
  await page.goto('/');

  // Soft assertions - test continues even if these fail
  await expect.soft(page.getByRole('heading')).toHaveText('Welcome');
  await expect.soft(page.getByRole('button')).toBeVisible();
  await expect.soft(page.getByRole('link')).toHaveCount(5);

  // Test will report all failures at the end
});
```

## Skipping and Focusing Tests

```typescript
// Skip a test
test.skip('feature not implemented', async ({ page }) => {});

// Skip conditionally
test('mobile only feature', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'This test is for mobile only');
});

// Focus on specific test (development only)
test.only('debug this test', async ({ page }) => {});

// Mark as expected to fail
test.fail('known bug', async ({ page }) => {});
```

## Annotations

```typescript
test('slow test', async ({ page }) => {
  test.slow(); // Triples the timeout
});

test('flaky test', async ({ page }) => {
  test.fixme(); // Skip and mark as needing fix
});

test.describe('feature', () => {
  test.describe.configure({ retries: 2 }); // Configure retries for group
});
```

## References

- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Test Annotations](https://playwright.dev/docs/test-annotations)
