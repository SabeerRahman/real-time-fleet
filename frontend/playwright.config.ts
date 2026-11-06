import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  reporter: [['list'], ['html', { outputFolder: '../playwright-report', open: 'never' }]],
  use: { baseURL: 'http://localhost:5174', screenshot: 'only-on-failure' }
})
