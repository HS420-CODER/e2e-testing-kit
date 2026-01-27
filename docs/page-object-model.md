# Page Object Model (POM)

> Source: [Playwright Official Documentation](https://playwright.dev/docs/pom)

The Page Object Model is a design pattern that creates an abstraction layer between tests and page interactions, making tests more readable and maintainable.

## Benefits

- **Maintainability**: Change locators in one place
- **Readability**: Tests describe intent, not implementation
- **Reusability**: Share common interactions across tests
- **Encapsulation**: Hide page complexity from tests

## Basic Example

### Page Object Class

```typescript
// pages/login.page.ts
import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}
```

### Using the Page Object in Tests

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('invalid credentials show error', async () => {
    await loginPage.login('wrong@example.com', 'wrongpass');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });
});
```

## Advanced: Using Fixtures

Create custom fixtures to automatically inject page objects:

```typescript
// fixtures/test.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
```

### Using Fixtures in Tests

```typescript
// tests/dashboard.spec.ts
import { test, expect } from '../fixtures/test';

test('user can access dashboard after login', async ({ loginPage, dashboardPage, page }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(dashboardPage.welcomeMessage).toBeVisible();
});
```

## Complete Example: Todo App

```typescript
// pages/todo.page.ts
import type { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly inputBox: Locator;
  readonly todoItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputBox = page.locator('input.new-todo');
    this.todoItems = page.getByTestId('todo-item');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  async addTodo(text: string) {
    await this.inputBox.fill(text);
    await this.inputBox.press('Enter');
  }

  async removeTodo(text: string) {
    const todo = this.todoItems.filter({ hasText: text });
    await todo.hover();
    await todo.getByLabel('Delete').click();
  }

  async toggleTodo(text: string) {
    const todo = this.todoItems.filter({ hasText: text });
    await todo.getByRole('checkbox').click();
  }

  async getTodoCount() {
    return this.todoItems.count();
  }
}
```

## Best Practices

1. **One class per page/component** - Keep page objects focused
2. **Expose meaningful methods** - `login()` not `fillEmail()` + `fillPassword()` + `clickSubmit()`
3. **Don't include assertions in page objects** - Keep assertions in tests
4. **Use descriptive method names** - Make tests read like documentation
5. **Initialize locators in constructor** - Centralize element definitions

## References

- [Playwright POM Documentation](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
