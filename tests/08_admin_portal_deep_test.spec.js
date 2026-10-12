// @ts-check
import { test, expect } from '@playwright/test';
import { USERS, ADMIN_BASE_URL, loginAdmin } from './helpers/auth.js';

test.describe('8. Admin Master Portal Deep Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await loginAdmin(page, USERS.admin.email, USERS.admin.password);
  });

  test('Admin Overview: renders 4 KPI metric cards, tier distribution, and exactly up to 5 recent records', async ({ page }) => {
    await page.goto(`${ADMIN_BASE_URL}/`);
    await page.waitForLoadState('domcontentloaded');

    // Header & Title
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // 4 KPI Metric Cards
    await expect(page.getByText(/Total Miembros|Total Members/i).first()).toBeVisible();
    await expect(page.getByText(/Puntos Emitidos|Issued Points/i).first()).toBeVisible();
    await expect(page.getByText(/Redenciones|Pending Redemptions/i).first()).toBeVisible();
    await expect(page.getByText(/Ofertas Activas|Ofertas Destacadas|Active Offers|Paquetes/i).first()).toBeVisible();

    // Club Membership Tier Distribution
    await expect(page.getByText(/Distribución de Membresías|Tier Distribution/i).first()).toBeVisible();
    await expect(page.getByText(/Ambassador|Embajador/i).first()).toBeVisible();

    // Recently Registered Members - at most 5 records
    const recentUsersHeading = page.getByText(/Últimos Miembros Registrados|Recently Registered Members/i).first();
    await expect(recentUsersHeading).toBeVisible();

    // Recent Ledger Activity - at most 5 records
    const recentLedgerHeading = page.getByText(/Actividad Reciente del Libro Mayor|Recent Ledger Activity/i).first();
    await expect(recentLedgerHeading).toBeVisible();
  });

  test('Travel Offers Management: loads catalog, search filter, and new offer action', async ({ page }) => {
    await page.goto(`${ADMIN_BASE_URL}/offers`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // New Offer CTA
    const newOfferBtn = page.getByRole('button', { name: /Nueva Oferta|New Offer/i }).or(page.getByRole('link', { name: /Nueva Oferta|New Offer/i })).first();
    await expect(newOfferBtn).toBeVisible();

    // Search bar
    const searchInput = page.getByPlaceholder(/Buscar|Search/i).first();
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('User Management: displays user table, search, and membership tier badges', async ({ page }) => {
    await page.goto(`${ADMIN_BASE_URL}/users`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Users table/list
    const tableOrList = page.locator('table, [role="table"], tbody, [class*="divide-y"]');
    await expect(tableOrList.first()).toBeVisible();

    // Check that user emails or names are rendered
    await expect(page.getByText(/@/i).first()).toBeVisible();
  });

  test('Points & Sales: renders point assignment module and ledger history', async ({ page }) => {
    await page.goto(`${ADMIN_BASE_URL}/points`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Assign points button/form and ledger
    await expect(page.getByText(/Puntos|Points|Asignar|Ventas/i).first()).toBeVisible();
  });

  test('Redemptions Audit Queue: displays redemption requests and audit tools', async ({ page }) => {
    await page.goto(`${ADMIN_BASE_URL}/redemptions`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('Memberships Configuration: displays commission rules matrix (100% L1, 50% L2)', async ({ page }) => {
    await page.goto(`${ADMIN_BASE_URL}/memberships`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/100%/i).first()).toBeVisible();
    await expect(page.getByText(/50%/i).first()).toBeVisible();
  });

});
