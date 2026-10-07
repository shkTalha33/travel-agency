// @ts-check
import { test, expect } from '@playwright/test';

test.describe('4. Member Dashboard & Tier Permissions Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Sofía (Ambassador)
    await page.goto('/login');
    const emailInput = page.getByLabel(/Correo/i).first();
    const passInput = page.getByLabel(/Contraseña/i).first();
    const loginBtn = page.getByRole('button', { name: /Iniciar sesión|Acceder/i });

    await emailInput.fill('sofia.almonte@ejemplo.com');
    await passInput.fill('Password123!');
    await loginBtn.click();
    await page.waitForURL(/\/dashboard/);
  });

  test('Ambassador Dashboard displays Level 1 and Level 2 point stats and network preview', async ({ page }) => {
    await page.goto('/dashboard');

    // Welcome banner & Ambassador badge
    await expect(page.getByText(/Sofía/i).first()).toBeVisible();
    await expect(page.getByText(/Embajador|Ambassador/i).first()).toBeVisible();

    // Ambassador sees both Level 1 and Level 2 points
    await expect(page.getByText(/Puntos Nivel 1/i).first()).toBeVisible();
    await expect(page.getByText(/Puntos Nivel 2/i).first()).toBeVisible();

    // Referral code & copy invite button
    await expect(page.getByText(/SOFIA-VIAJES/i).first()).toBeVisible();

    // Recent transaction list
    await expect(page.getByText(/Actividad reciente/i).first()).toBeVisible();
  });

  test('Member navigation bar links to all dashboard sections', async ({ page }) => {
    await page.goto('/dashboard');

    // If mobile/tablet viewport, open drawer
    const drawerBtn = page.locator('button[aria-controls="panel-drawer"]');
    if (await drawerBtn.isVisible()) {
      await drawerBtn.click();
    }

    // Check navigation links
    const pointsLink = page.getByRole('link', { name: /Mis puntos|Puntos|Points/i }).first();
    await expect(pointsLink).toBeVisible();

    const networkLink = page.getByRole('link', { name: /Mi red|Red|Network/i }).first();
    await expect(networkLink).toBeVisible();

    const profileLink = page.getByRole('link', { name: /Perfil|Profile/i }).first();
    await expect(profileLink).toBeVisible();
  });
});
