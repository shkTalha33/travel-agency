// @ts-check
import { test, expect } from '@playwright/test';

test.describe('5. Points Ledger & Redemptions Workflow Test Suite', () => {
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

  test('Points page renders VIP balance card, meteors and transaction ledger', async ({ page }) => {
    await page.goto('/dashboard/points');

    // Title
    await expect(page.getByText(/Billetera de Puntos|Mis puntos/i).first()).toBeVisible();

    // Balance card & PTS indicator
    await expect(page.getByText(/PTS/i).first()).toBeVisible();

    // Redimir Puntos CTA button
    const redeemBtn = page.getByRole('link', { name: /Redimir Puntos/i }).first();
    await redeemBtn.scrollIntoViewIfNeeded();
    await expect(redeemBtn).toBeVisible();

    // Transaction list
    const historyHeader = page.getByText(/Historial/i).first();
    await historyHeader.scrollIntoViewIfNeeded();
    await expect(historyHeader).toBeVisible();
  });

  test('Redemption page validates 50 points minimum and opens confirmation modal', async ({ page }) => {
    await page.goto('/dashboard/redeem');
    await expect(page.getByText(/Redimir puntos/i).first()).toBeVisible();

    const amountInput = page.getByLabel(/Cantidad/i);
    const submitBtn = page.getByRole('button', { name: /Redimir puntos/i });

    // Try entering 10 points (less than 50 points minimum)
    await amountInput.fill('10');
    await submitBtn.click();

    // Verify minimum error is shown
    await expect(page.getByText(/mínimo|mínima|50/i).first()).toBeVisible();

    // Fill valid amount >= 50
    await amountInput.fill('50');
    await submitBtn.click();

    // Verify confirmation modal pops up
    await expect(page.getByText(/Confirmar solicitud/i)).toBeVisible();

    // Click confirm in modal
    const confirmBtn = page.getByRole('button', { name: /Enviar solicitud|Continuar/i }).last();
    await confirmBtn.click();
  });
});
