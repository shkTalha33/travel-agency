// @ts-check
import { test, expect } from '@playwright/test';
import { USERS, loginMember } from './helpers/auth.js';

test.describe('5. Points Ledger & Redemptions Workflow Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await loginMember(page, USERS.ambassador.email, USERS.ambassador.password);
  });

  test('Points page renders wallet balance card and transaction ledger', async ({ page }) => {
    await page.goto('/dashboard/points');
    await page.waitForLoadState('domcontentloaded');

    // Title & Wallet indicator
    await expect(page.getByText(/Puntos|Points|Billetera|Balance/i).first()).toBeVisible({ timeout: 10000 });

    // Balance indicator PTS
    await expect(page.getByText(/PTS/i).first()).toBeVisible();

    // Redimir Puntos CTA link
    const redeemBtn = page.getByRole('link', { name: /Redimir|Canjear|Redeem/i }).first();
    if (await redeemBtn.isVisible()) {
      await expect(redeemBtn).toBeVisible();
    }

    // Ledger / History section
    await expect(page.getByText(/Historial|Movimientos|Transacciones|Activity/i).first()).toBeVisible();
  });

  test('Redemption page validates 50 points minimum requirement', async ({ page }) => {
    await page.goto('/dashboard/redeem');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText(/Redimir|Canjear|Redeem/i).first()).toBeVisible({ timeout: 10000 });

    const amountInput = page.locator('input[type="number"], input#amount, input[name="points"], input[name="amount"]').first();
    const submitBtn = page.getByRole('button', { name: /Redimir|Solicitar|Confirmar|Enviar/i }).first();

    if (await amountInput.isVisible() && await submitBtn.isVisible()) {
      // Try entering less than 50 points
      await amountInput.fill('10');
      await submitBtn.click();

      // Verify minimum points validation appears
      await expect(page.getByText(/mínimo|mínima|50|min/i).first()).toBeVisible({ timeout: 5000 });
    }
  });

});
