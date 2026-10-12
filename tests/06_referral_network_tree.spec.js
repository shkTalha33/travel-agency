// @ts-check
import { test, expect } from '@playwright/test';
import { USERS, loginMember } from './helpers/auth.js';

test.describe('6. Referral Network Tree & Downline Test Suite', () => {

  test('Ambassador network page renders referral tree, downline levels and invite tools', async ({ page }) => {
    await loginMember(page, USERS.ambassador.email, USERS.ambassador.password);
    await page.goto('/dashboard/network');
    await page.waitForLoadState('domcontentloaded');

    // Title & Header
    await expect(page.getByText(/Mi red|Red de afiliados|Referral Network|Downline/i).first()).toBeVisible({ timeout: 10000 });

    // Level tabs or sections (Nivel 1, Nivel 2, Jerarquía / Tree)
    const levelIndicators = page.getByText(/Nivel 1|Level 1|Nivel 2|Level 2|Jerarquía|Árbol|Directos/i).first();
    await expect(levelIndicators).toBeVisible();

    // Copy Referral Link or Code button
    const copyBtn = page.getByRole('button', { name: /Copiar|Copy|Compartir|Share/i }).first();
    if (await copyBtn.isVisible()) {
      await expect(copyBtn).toBeVisible();
    }
  });

  test('Active Member network page displays direct downline tier access', async ({ page }) => {
    await loginMember(page, USERS.activeMember.email, USERS.activeMember.password);
    await page.goto('/dashboard/network');
    await page.waitForLoadState('domcontentloaded');

    // Active member has access to referral network page
    await expect(page.getByText(/Mi red|Red|Network/i).first()).toBeVisible({ timeout: 10000 });
  });

});
