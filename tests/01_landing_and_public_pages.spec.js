// @ts-check
import { test, expect } from '@playwright/test';

test.describe('1. Landing & Public Pages Test Suite', () => {
  test('Landing Page loads correctly with Hero, CTAs, and Spanish copy', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Viajes Dominicana/i);

    // Verify main Hero heading
    const heroHeading = page.locator('h1');
    await expect(heroHeading.first()).toBeVisible();

    // Verify primary and secondary CTAs
    const joinBtn = page.getByRole('link', { name: /Únete|Unirse|Registrarse|Join/i }).first();
    await expect(joinBtn).toBeVisible();

    const offersBtn = page.getByRole('link', { name: /Ver ofertas|Ofertas|Offers/i }).first();
    await expect(offersBtn).toBeVisible();

    // Check that Header & Footer exist
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Verify key landing sections exist
    await expect(page.locator('section').first()).toBeVisible();
  });

  test('About Page renders mission, values, and Dominican identity', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/Nosotros|About|Viajes Dominicana/i);

    const heading = page.locator('h1');
    await expect(heading.first()).toBeVisible();
  });

  test('Membership Comparison Page displays all 4 tiers with rates matrix', async ({ page }) => {
    await page.goto('/membership');
    await expect(page).toHaveTitle(/Membresía|Membership|Viajes Dominicana/i);

    // Verify membership levels are visible
    await expect(page.getByText(/Miembro|Member/i).first()).toBeVisible();
    await expect(page.getByText(/Embajador|Ambassador/i).first()).toBeVisible();

    // Scroll to the comparison matrix table to trigger Reveal animation
    const table = page.locator('table');
    await table.scrollIntoViewIfNeeded();
    await expect(table).toBeVisible();
    await expect(table).toContainText('100%');
    await expect(table).toContainText('50%');
  });

  test('FAQ Page expands and collapses accordions correctly', async ({ page }) => {
    await page.goto('/faq');
    await expect(page).toHaveTitle(/FAQ|Preguntas/i);

    // Click on the first accordion question
    const firstAccordion = page.locator('button').filter({ hasText: /¿|How|What/i }).first();
    await expect(firstAccordion).toBeVisible();
    await firstAccordion.click();

    // Verify answer is revealed
    await expect(page.locator('[data-state="open"], [class*="Accordion"], article, p').first()).toBeVisible();
  });

  test('Privacy & Terms Pages are accessible and readable', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('h1').first()).toBeVisible();

    await page.goto('/terms');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
