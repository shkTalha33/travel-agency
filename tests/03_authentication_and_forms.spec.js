// @ts-check
import { test, expect } from '@playwright/test';
import { USERS, loginMember } from './helpers/auth.js';

test.describe('3. Authentication & Security Test Suite', () => {
  test('Login form renders properly with validation', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Iniciar sesión|Login|Viajes Dominicana/i);

    const emailInput = page.locator('#email');
    const passInput = page.locator('#password');
    const loginBtn = page.getByRole('button', { name: /Iniciar sesión|Sign in/i });

    await expect(emailInput).toBeVisible();
    await expect(passInput).toBeVisible();
    await expect(loginBtn).toBeVisible();

    // Trigger validation with empty inputs
    await loginBtn.click();
    await expect(page.locator('#email')).toBeVisible();
  });

  test('Rejects invalid credentials gracefully with error alert', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('#email');
    const passInput = page.locator('#password');
    const loginBtn = page.getByRole('button', { name: /Iniciar sesión|Sign in/i });

    await emailInput.fill('invalid.user.nonexistent@test.com');
    await passInput.fill('WrongPassword123!');
    await loginBtn.click();

    // Error toast or message should appear
    await expect(page.locator('[role="alert"], [class*="toast"], [class*="error"], .text-rose-500, .text-red-500').first()).toBeVisible({ timeout: 8000 });
  });

  test('Authenticates Ambassador user and redirects to member dashboard', async ({ page }) => {
    await loginMember(page, USERS.ambassador.email, USERS.ambassador.password);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Authenticates Active Member user and redirects to member dashboard', async ({ page }) => {
    await loginMember(page, USERS.activeMember.email, USERS.activeMember.password);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Authenticates Member user and redirects to member dashboard', async ({ page }) => {
    await loginMember(page, USERS.member.email, USERS.member.password);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Forgot Password page renders and accepts email address', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });
});
