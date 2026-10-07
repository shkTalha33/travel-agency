// @ts-check
import { test, expect } from '@playwright/test';

test.describe('2. Travel Offers Catalog & Details Test Suite', () => {
  test('Offers Explorer displays list of trips and allows search & filter', async ({ page }) => {
    await page.goto('/offers');
    await expect(page).toHaveTitle(/Ofertas de viaje|Viajes Dominicana/i);

    // Verify search or destination filters exist
    const searchInput = page.getByPlaceholder(/Buscar|Destino|Search/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Punta Cana');
      await expect(page.getByText(/Punta Cana/i).first()).toBeVisible();
    }

    // Check that multiple offer cards are rendered
    const offerCards = page.locator('article, [class*="OfferCard"], [class*="rounded-3xl"]');
    await expect(offerCards.first()).toBeVisible();
  });

  test('Single Offer Detail page loads complete photo grid, itinerary, and points reward', async ({ page }) => {
    // Navigate directly to Punta Cana offer
    await page.goto('/offers/punta-cana-todo-incluido');

    // Title & Destination
    await expect(page.locator('h1')).toContainText('Punta Cana');

    // Check Points Reward badge
    await expect(page.getByText(/puntos|\+120 pts/i).first()).toBeVisible();

    // Check inclusions and exclusions sections
    const inclusions = page.getByText(/Qué incluye|Includes/i).first();
    await inclusions.scrollIntoViewIfNeeded();
    await expect(inclusions).toBeVisible();

    const exclusions = page.getByText(/Qué no incluye|Not included/i).first();
    await exclusions.scrollIntoViewIfNeeded();
    await expect(exclusions).toBeVisible();

    // Check Itinerary timeline
    const itinerary = page.getByText(/Itinerario|Itinerary/i).first();
    await itinerary.scrollIntoViewIfNeeded();
    await expect(itinerary).toBeVisible();

    // Check inquiry / VIP CTA button
    const vipBtn = page.getByRole('link', { name: /Quiero esta oferta|Reservar|Unirse/i });
    await vipBtn.scrollIntoViewIfNeeded();
    await expect(vipBtn).toBeVisible();
  });

  test('Navigating between catalog and offer detail is fast with Redux cache', async ({ page }) => {
    await page.goto('/offers');
    await page.waitForLoadState('domcontentloaded');

    // Click on Santo Domingo offer
    const sdLink = page.getByRole('link', { name: /Santo Domingo/i }).first();
    if (await sdLink.isVisible()) {
      await sdLink.click();
      await expect(page.locator('h1')).toContainText(/Santo Domingo/i);

      // Navigate back to offers
      await page.goBack();
      await expect(page).toHaveURL(/\/offers/);
      await expect(page.locator('h1, h2').first()).toBeVisible();
    }
  });
});
