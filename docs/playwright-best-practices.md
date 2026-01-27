# Playwright Best Practices

> Source: [Playwright Official Documentation](https://playwright.dev/docs/best-practices)

## Use Locators

Playwright's built-in locators come with **auto-waiting** and **retry-ability**:

- Auto-waiting ensures the element is visible and enabled before actions
- Prioritize user-facing attributes and explicit contracts for resilient tests

### Recommended Locator Priority

```typescript
// 1. Role-based (BEST - mirrors how users interact)
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: 'Sign in' })
page.getByRole('heading', { name: 'Welcome' })

// 2. Label-based (for form elements)
page.getByLabel('Email address')
page.getByLabel('Password')

// 3. Placeholder-based
page.getByPlaceholder('Enter your email')

// 4. Text-based (for non-interactive elements)
page.getByText('Welcome back')

// 5. Test ID (when semantic locators aren't possible)
page.getByTestId('submit-button')

// AVOID: CSS/XPath selectors (fragile, tied to implementation)
// page.locator('.btn-primary')  // Not recommended
// page.locator('//div[@class="container"]')  // Not recommended
```

## Use Web-First Assertions

Web-first assertions automatically wait and retry until the condition is met:

```typescript
// GOOD: Web-first assertions (auto-wait)
await expect(page.getByRole('heading')).toHaveText('Welcome');
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.locator('.status')).toBeVisible();

// AVOID: Manual waits
// await page.waitForTimeout(1000);  // Not recommended
```

### Common Assertions

```typescript
// Visibility
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();

// Text content
await expect(locator).toHaveText('Expected text');
await expect(locator).toContainText('partial text');

// Attributes
await expect(locator).toHaveAttribute('href', '/about');
await expect(locator).toHaveClass(/active/);

// Form state
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeChecked();

// Page assertions
await expect(page).toHaveTitle(/Dashboard/);
await expect(page).toHaveURL(/\/dashboard/);
```

## Test Isolation

Each test runs in complete isolation with its own browser context:

```typescript
test('first test', async ({ page }) => {
  // This page is isolated - like a fresh browser profile
});

test('second test', async ({ page }) => {
  // Completely separate from the first test
  // No cookies, localStorage, or state shared
});
```

## Configure Debugging

Use Playwright's built-in debugging tools:

```bash
# Run with UI mode (interactive)
npx playwright test --ui

# Run with headed browser
npx playwright test --headed

# Debug a specific test
npx playwright test --debug

# Show browser console
npx playwright test --headed --reporter=list
```

## Avoid Testing Third-Party Dependencies

- Don't test external services you don't control
- Mock external APIs when possible
- Focus on your application's behavior

## Test User-Visible Behavior

- Test what users see and do, not implementation details
- Verify outcomes, not internal state
- Write tests that would still pass if you refactored the code

## References

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Documentation](https://playwright.dev/docs/locators)
- [Assertions Documentation](https://playwright.dev/docs/test-assertions)
