import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/system',
  fullyParallel: false, // Run E2E tests sequentially to avoid database conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Single worker avoids database collisions during tests
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 120000,
    env: {
      MONGO_URL: 'mongodb://localhost:27017/sahajogtg_test',
      NEXTAUTH_SECRET: 'test_secret_for_jwt_signing_purposes',
      NEXTAUTH_URL: 'http://localhost:3000',
    },
  },
});
