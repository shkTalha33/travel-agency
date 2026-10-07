// @ts-check
import { test, expect } from '@playwright/test';

test.describe('7. Mobile Responsiveness & Accessibility Test Suite', () => {
  test('Mobile viewport renders mobile navigation drawer and opens on hamburger click', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Locate the hamburger menu toggle button via aria-controls="mobile-nav"
    const menuBtn = page.locator('button[aria-controls="mobile-nav"]');
    await expect(menuBtn).toBeVisible();

    // Click to expand drawer
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

    // Verify mobile drawer navigation container expands
    const mobileNav = page.locator('#mobile-nav');
    await expect(mobileNav).toBeVisible();

    // Verify links inside mobile navigation
    const navLinks = mobileNav.locator('a');
    await expect(navLinks.first()).toBeVisible();
    await expect(navLinks.first()).toHaveAttribute('href');
  });

  test('Page contains valid H1 heading and accessible landmark regions', async ({ page }) => {
    await page.goto('/');

    // Exactly one or prominent H1
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();

    // Check main and header landmarks
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
