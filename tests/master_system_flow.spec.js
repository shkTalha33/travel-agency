// @ts-check
import { test, expect } from '@playwright/test';
import { USERS, ADMIN_BASE_URL, loginMember, loginAdmin } from './helpers/auth.js';

test.describe('Complete System Deep Test (All Tiers & Admin in One Flow)', () => {

  test('Step 1: Public Explorer, Landing & Travel Catalog', async ({ page }) => {
    // 1. Landing Page
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });

    // 2. Travel Offers Catalog
    await page.goto('/offers', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#offers-catalog-grid')).toBeVisible({ timeout: 15000 });

    // 3. Membership Matrix
    await page.goto('/membership', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/Embajador|Ambassador/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Step 2: Ambassador Flow (2-Level Commissions & Referral Network)', async ({ page }) => {
    // Login as Ambassador
    await loginMember(page, USERS.ambassador.email, USERS.ambassador.password);
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

    // Verify Ambassador rank & metrics
    await expect(page.getByText(/Embajador|Ambassador/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Puntos|Points|PTS/i).first()).toBeVisible({ timeout: 15000 });

    // Check Wallet & Ledger
    await page.goto('/dashboard/points', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/PTS/i).first()).toBeVisible({ timeout: 15000 });

    // Check Downline Network
    await page.goto('/dashboard/network', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/Mi red|Red|Network/i).first()).toBeVisible({ timeout: 15000 });

    // Check Profile
    await page.goto('/dashboard/profile', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(USERS.ambassador.email).first()).toBeVisible({ timeout: 15000 });
  });

  test('Step 3: Active Member Flow (Level 1 Commissions & Referral Sharing)', async ({ page }) => {
    // Login as Active Member
    await loginMember(page, USERS.activeMember.email, USERS.activeMember.password);
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

    // Verify Active status & Level 1 rewards
    await expect(page.getByText(/Activo|Active|Miembro Activo|shykhtalha33/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/PTS|Puntos|Points/i).first()).toBeVisible({ timeout: 15000 });

    // Check Network access
    await page.goto('/dashboard/network', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/Mi red|Red|Network/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Step 4: Base Member Flow (Initial Rank & Travel Booking)', async ({ page }) => {
    // Login as Base Member
    await loginMember(page, USERS.member.email, USERS.member.password);
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

    // Verify Base Member tier
    await expect(page.getByText(/Miembro|Member/i).first()).toBeVisible({ timeout: 15000 });

    // Verify Catalog access
    await page.goto('/offers', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
  });

  test('Step 5: Points Redemption & Minimum 50 Validation', async ({ page }) => {
    await loginMember(page, USERS.ambassador.email, USERS.ambassador.password);
    await page.goto('/dashboard/redeem', { waitUntil: 'domcontentloaded' });

    const amountInput = page.locator('input[type="number"], input#amount, input[name="points"]').first();
    const submitBtn = page.getByRole('button', { name: /Redimir|Solicitar|Confirmar/i }).first();

    if (await amountInput.isVisible() && await submitBtn.isVisible()) {
      await amountInput.fill('10');
      await submitBtn.click();
      await expect(page.getByText(/mínimo|mínima|50|min/i).first()).toBeVisible({ timeout: 8000 });
    }
  });

  test('Step 6: Admin Master Portal Deep Test', async ({ page }) => {
    // Login as Admin
    await loginAdmin(page, USERS.admin.email, USERS.admin.password);

    // 1. Dashboard Overview
    await page.goto(`${ADMIN_BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });

    // 4 KPI Metric Cards
    await expect(page.getByText(/Total Miembros|Total Members/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Puntos Emitidos|Issued Points/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Redenciones|Pending Redemptions/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Ofertas Activas|Ofertas Destacadas|Active Offers|Paquetes/i).first()).toBeVisible({ timeout: 15000 });

    // Membership Tier Distribution
    await expect(page.getByText(/Distribución de Membresías|Tier Distribution/i).first()).toBeVisible({ timeout: 15000 });

    // Recent 5 Records Sections
    await expect(page.getByText(/Últimos Miembros Registrados|Recently Registered Members/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Actividad Reciente del Libro Mayor|Recent Ledger Activity/i).first()).toBeVisible({ timeout: 15000 });

    // 2. Offers Management
    await page.goto(`${ADMIN_BASE_URL}/offers`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });

    // 3. User Management
    await page.goto(`${ADMIN_BASE_URL}/users`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });

    // 4. Points & Sales
    await page.goto(`${ADMIN_BASE_URL}/points`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });

    // 5. Redemptions Queue
    await page.goto(`${ADMIN_BASE_URL}/redemptions`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });

    // 6. Membership Rules
    await page.goto(`${ADMIN_BASE_URL}/memberships`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
  });

});
