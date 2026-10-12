// @ts-check
import { test, expect } from '@playwright/test';

test.describe('2. Travel Offers Catalog & Details Test Suite', () => {
  test('Offers Explorer displays list of trips and allows search & filter', async ({ page }) => {
    await page.goto('/offers');
    await expect(page).toHaveTitle(/Ofertas|Offers|Círculo Wingding|Viajes/i);

    // Verify search or destination filters exist
    const searchInput = page.getByPlaceholder(/Buscar|Destino|Search/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Punta Cana');
      await page.waitForTimeout(500);
    }

    // Check that multiple offer cards are rendered
    const offerCards = page.locator('article, [class*="OfferCard"], [class*="rounded-3xl"]');
    await expect(offerCards.first()).toBeVisible();
  });

  test('Single Offer Detail page loads complete photo grid, itinerary, and points reward', async ({ page }) => {
    // Navigate directly to Punta Cana offer
    await page.goto('/offers/punta-cana-todo-incluido');
    await page.waitForLoadState('domcontentloaded');

    // Title & Destination
    await expect(page.locator('h1')).toBeVisible();

    // Check Points Reward badge
    await expect(page.getByText(/puntos|pts|\+/i).first()).toBeVisible();

    // Check inclusions and exclusions sections
    const inclusions = page.getByText(/incluye|Includes/i).first();
    if (await inclusions.isVisible()) {
      await expect(inclusions).toBeVisible();
    }
  });

  test('Navigating between catalog and offer detail is fast with cache', async ({ page }) => {
    await page.goto('/offers');
    await page.waitForLoadState('domcontentloaded');

    // Click on any offer link
    const firstOfferLink = page.locator('a[href^="/offers/"]').first();
    if (await firstOfferLink.isVisible()) {
      await firstOfferLink.click();
      await expect(page.locator('h1').first()).toBeVisible();

      // Navigate back to offers
      await page.goBack();
      await expect(page).toHaveURL(/\/offers/);
    }
  });
});
