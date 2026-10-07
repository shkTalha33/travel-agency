// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for deep E2E testing of Dominican Republic Travel & Referral Platform.
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 45 * 1000,
  expect: {
    timeout: 8000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use */
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/test-summary.json' }],
  ],
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    /* Capture screenshot and trace on failure */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    /* Emulate standard browser context */
    locale: 'es-DO',
    timezoneId: 'America/Santo_Domingo',
    colorScheme: 'light',
  },

  /* Configure projects for major browsers & viewports */
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'Mobile Chrome (Pixel 5)',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Tablet (iPad Mini)',
      use: {
        ...devices['iPad Mini'],
      },
    },
  ],

  /* Web server to automatically reuse or start frontend dev server */
  webServer: {
    command: 'npm run dev',
    cwd: './frontend',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
