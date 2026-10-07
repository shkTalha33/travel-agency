// @ts-check
import { test, expect } from '@playwright/test';

test.describe('6. Referral Network Tree & Downline Test Suite', () => {
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

  test('Network page shows Tree, Nivel 1 and Nivel 2 tabs and opens member modal', async ({ page }) => {
    await page.goto('/dashboard/network');

    // Header & Invite link card
    await expect(page.getByText(/Mi red/i).first()).toBeVisible();
    await expect(page.getByText(/SOFIA-VIAJES/i)).toBeVisible();

    // Tabs: Jerarquía, Nivel 1, Nivel 2
    const treeTab = page.getByRole('tab', { name: /Jerarquía/i }).or(page.getByText(/Jerarquía/i)).first();
    const l1Tab = page.getByRole('tab', { name: /Nivel 1/i }).or(page.getByText(/Nivel 1/i)).first();
    const l2Tab = page.getByRole('tab', { name: /Nivel 2/i }).or(page.getByText(/Nivel 2/i)).first();

    await expect(treeTab).toBeVisible();
    await expect(l1Tab).toBeVisible();
    await expect(l2Tab).toBeVisible();

    // Switch to Nivel 1 tab
    await l1Tab.click();
    await expect(page.getByText(/Marcos Peña|Laura Gómez/i).first()).toBeVisible();

    // Switch to Nivel 2 tab
    await l2Tab.click();
    await expect(page.getByText(/Gabriel Morales|Jorge Cruz/i).first()).toBeVisible();
  });
});
