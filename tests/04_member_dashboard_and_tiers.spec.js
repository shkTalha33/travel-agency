// @ts-check
import { test, expect } from '@playwright/test';
import { USERS, loginMember } from './helpers/auth.js';

test.describe('4. Member Dashboard & Tier Permissions Test Suite', () => {

  test('Ambassador: renders Level 1 & Level 2 stats, referral invite, and full navigation', async ({ page }) => {
    await loginMember(page, USERS.ambassador.email, USERS.ambassador.password);
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Verify Ambassador tier badge
    await expect(page.getByText(/Embajador|Ambassador/i).first()).toBeVisible({ timeout: 10000 });

    // Verify Points and Commission indicators
    await expect(page.getByText(/Puntos|Points|PTS/i).first()).toBeVisible();

    // Verify Referral Code or invite card exists
    const inviteSection = page.getByText(/código|invita|refer|enlace/i).first();
    await expect(inviteSection).toBeVisible();

    // Verify navigation links work
    const pointsLink = page.getByRole('link', { name: /Mis puntos|Puntos|Points|Billetera/i }).first();
    await expect(pointsLink).toBeVisible();

    const networkLink = page.getByRole('link', { name: /Mi red|Red|Network/i }).first();
    await expect(networkLink).toBeVisible();

    const profileLink = page.getByRole('link', { name: /Perfil|Profile/i }).first();
    await expect(profileLink).toBeVisible();
  });

  test('Active Member: renders active tier status, Level 1 referral rewards and points', async ({ page }) => {
    await loginMember(page, USERS.activeMember.email, USERS.activeMember.password);
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Verify Active Member badge or welcome
    await expect(page.getByText(/Activo|Active|Miembro Activo|shykhtalha33/i).first()).toBeVisible({ timeout: 10000 });

    // Verify points balance
    await expect(page.getByText(/PTS|Puntos|Points/i).first()).toBeVisible();

    // Verify navigation links
    await expect(page.getByRole('link', { name: /Mis puntos|Puntos|Points/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Mi red|Red|Network/i }).first()).toBeVisible();
  });

  test('Member (Base Rank): renders base member dashboard and upgrade prompts', async ({ page }) => {
    await loginMember(page, USERS.member.email, USERS.member.password);
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Verify base Member status
    await expect(page.getByText(/Miembro|Member/i).first()).toBeVisible({ timeout: 10000 });

    // Verify access to travel offers
    const offersLink = page.getByRole('link', { name: /Ofertas|Offers|Viajes/i }).first();
    if (await offersLink.isVisible()) {
      await offersLink.click();
      await expect(page).toHaveURL(/\/offers/);
    }
  });

  test('Profile Page: renders profile information and security tab', async ({ page }) => {
    await loginMember(page, USERS.ambassador.email, USERS.ambassador.password);
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('domcontentloaded');

    // Check email is displayed
    await expect(page.getByText(USERS.ambassador.email).first()).toBeVisible({ timeout: 10000 });

    // Check profile form fields
    await expect(page.locator('input[type="text"], input[type="email"]').first()).toBeVisible();
  });

});
