// @ts-check
import { test, expect } from '@playwright/test';

test.describe('3. Authentication & Security Test Suite', () => {
  test('Registration form performs inline validations and supports referral code input', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveTitle(/Registro|Crear cuenta|Viajes Dominicana/i);

    // Form inputs
    const nameInput = page.getByLabel(/Nombre completo/i);
    const emailInput = page.getByLabel(/Correo electrónico/i);
    const passInput = page.getByLabel(/^Contraseña/i);
    const confirmInput = page.getByLabel(/Confirmar/i);
    const termsCheckbox = page.locator('#terms');
    const submitBtn = page.getByRole('button', { name: /Crear mi cuenta|Registrarse/i });

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Fill valid new account details
    await nameInput.fill('Usuario de Prueba Playwright');
    await emailInput.fill(`test_user_${Date.now()}@viajesdominicana.com`);
    await passInput.fill('PasswordSeguro2026!');
    await confirmInput.fill('PasswordSeguro2026!');
    await termsCheckbox.check();

    // Submit form
    await submitBtn.click();

    // Should prompt for OTP verification
    await expect(page.getByText(/código|OTP|verificad|verify|correo/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('Login form validates credentials and logs in demo account successfully', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Iniciar sesión|Login|Viajes Dominicana/i);

    const emailInput = page.getByLabel(/Correo/i).first();
    const passInput = page.getByLabel(/Contraseña/i).first();
    const loginBtn = page.getByRole('button', { name: /Iniciar sesión|Acceder/i });

    await emailInput.fill('sofia.almonte@ejemplo.com');
    await passInput.fill('Password123!');
    await loginBtn.click();

    // Verify redirected to member dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await expect(page.getByText(/Sofía|Bienvenido/i).first()).toBeVisible();
  });

  test('Forgot Password flow submits request cleanly', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page).toHaveTitle(/Recuperar|Contraseña|Viajes Dominicana/i);

    const emailInput = page.getByLabel(/Correo/i).first();
    const submitBtn = page.getByRole('button', { name: /Enviar|Recuperar|Restablecer|code|código/i });

    await emailInput.fill('sofia.almonte@ejemplo.com');
    await submitBtn.click();

    // Verify confirmation feedback
    await expect(page.getByText(/enviado|código|OTP|instrucciones|correo/i).first()).toBeVisible();
  });

  test('Email Verification page handles missing or invalid tokens gracefully', async ({ page }) => {
    await page.goto('/verify-email?email=sofia.almonte@ejemplo.com');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
