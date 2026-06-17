import { test, expect } from '@playwright/test';

test.describe('Authentication and Route Protection System Tests', () => {
  test('should redirect unauthenticated users from /admin/dashboard to /login', async ({ page }) => {
    // Navigate directly to the protected admin dashboard
    await page.goto('/admin/dashboard');

    // Verify the user is redirected to the login page
    await expect(page).toHaveURL(/\/login/);

    // Verify the URL contains the appropriate error query parameter
    const url = page.url();
    expect(url).toContain('error=Please%20login%20first%20to%20access%20this%20route');
  });

  test('should render the login form correctly', async ({ page }) => {
    // Navigate directly to the login page
    await page.goto('/login');

    // Verify page title or header
    const heading = page.locator('h2, h1, form h2');
    await expect(heading.first()).toBeVisible();

    // Verify email and password input fields are visible
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.getByRole('button', { name: 'Login', exact: true });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });
});
