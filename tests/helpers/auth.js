// @ts-check

export const USERS = {
  ambassador: {
    email: 'taha.nisar8877@gmail.com',
    password: '12345678',
    role: 'ambassador',
    label: 'Ambassador',
  },
  activeMember: {
    email: 'shykhtalha33@gmail.com',
    password: '12345678',
    role: 'active_member',
    label: 'Active Member',
  },
  member: {
    email: 'bepefeh997@calirona.com',
    password: '12345678',
    role: 'member',
    label: 'Member',
  },
  admin: {
    email: 'admin@gmail.com',
    password: 'Admin@12345',
    role: 'admin',
    label: 'Admin',
  },
};

export const ADMIN_BASE_URL = process.env.ADMIN_URL || 'http://localhost:3001';

/**
 * Logs in a member via the frontend login page.
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 * @param {string} password
 */
export async function loginMember(page, email, password) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  const emailInput = page.locator('#email');
  await emailInput.waitFor({ state: 'visible', timeout: 15000 });

  const passInput = page.locator('#password');
  const loginBtn = page.locator('button[type="submit"]');

  await emailInput.fill(email);
  await passInput.fill(password);
  await loginBtn.click();

  await page.waitForURL(/\/dashboard/, { timeout: 20000 });
}

/**
 * Logs in an admin via the admin login portal.
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 * @param {string} password
 */
export async function loginAdmin(page, email, password) {
  await page.goto(`${ADMIN_BASE_URL}/login`, { waitUntil: 'domcontentloaded' });

  const emailInput = page.locator('input[type="email"]');
  await emailInput.waitFor({ state: 'visible', timeout: 15000 });

  const passInput = page.locator('input[type="password"]');
  const submitBtn = page.locator('button[type="submit"]');

  await emailInput.fill(email);
  await passInput.fill(password);
  await submitBtn.click();

  await page.waitForURL(new RegExp(`${ADMIN_BASE_URL}/?$`), { timeout: 20000 });
}
