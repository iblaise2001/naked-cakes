import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: process.env.BASE || 'http://localhost:8788', trace: 'retain-on-failure' },
  webServer: { command: 'npx wrangler pages dev dist --port 8788', url: 'http://localhost:8788', reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
  ],
});
