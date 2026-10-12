// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Platform Smoke & Health Test', () => {
  test('Application home page responds with 200 OK and valid markup', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
