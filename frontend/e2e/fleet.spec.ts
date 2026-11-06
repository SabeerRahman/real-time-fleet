import { test, expect, type Page } from '@playwright/test'

const shots = '../e2e-screenshots'
const login = async (page: Page, email = 'admin@fleet.demo') => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Demo sign in' })).toBeVisible()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('Demo@123')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Fleet overview' })).toBeVisible()
}

test('admin workflow, responsive views, and evidence screenshots', async ({ page }) => {
  await page.goto('/login')
  await page.screenshot({ path: `${shots}/01-login.png`, fullPage: true })
  await login(page)
  await expect(page.getByText(/Connected|Last simulated update/)).toBeVisible()
  await page.screenshot({ path: `${shots}/02-dashboard.png`, fullPage: true })

  await page.getByRole('link', { name: 'Vehicles' }).click()
  await expect(page.getByRole('heading', { name: 'Vehicle directory' })).toBeVisible()
  await page.getByPlaceholder('Search registration, driver or city').fill('DL')
  await expect(page.getByText('DL 01 FT 1024')).toBeVisible()
  await page.screenshot({ path: `${shots}/03-vehicle-list.png`, fullPage: true })

  await page.getByRole('link', { name: 'Open' }).first().click()
  await expect(page.getByText('Telemetry')).toBeVisible()
  await page.screenshot({ path: `${shots}/04-vehicle-detail.png`, fullPage: true })
  await page.getByRole('button', { name: /Simulate relay/ }).click()
  await page.getByLabel('Reason').fill('Playwright academic demonstration')
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Confirm simulation' }).click()
  await expect(page.getByText(/Relay simulation/)).toBeVisible()
  await page.screenshot({ path: `${shots}/06-relay-simulation.png`, fullPage: true })

  await page.getByRole('link', { name: 'Geofences' }).click()
  await expect(page.getByRole('heading', { name: 'Geofences' })).toBeVisible()
  await page.getByPlaceholder('Geofence name').fill('Playwright Demo Zone')
  await page.getByPlaceholder('Center / city').fill('Kochi')
  await page.getByRole('button', { name: 'Add geofence' }).click()
  await expect(page.getByRole('heading', { name: 'Playwright Demo Zone' }).first()).toBeVisible()
  await page.screenshot({ path: `${shots}/05-geofence.png`, fullPage: true })

  await page.getByRole('link', { name: 'Vehicles' }).click()
  await page.getByRole('button', { name: 'Demo error state' }).click()
  await expect(page.getByText('Unable to load demonstration data')).toBeVisible()
  await page.screenshot({ path: `${shots}/07-loading-error-state.png`, fullPage: true })
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByText('DL 01 FT 1024')).toBeVisible()

  await page.getByRole('link', { name: 'Dashboard' }).click()
  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page.getByRole('link', { name: 'वाहन' })).toBeVisible()
  await page.screenshot({ path: `${shots}/09-localization.png`, fullPage: true })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: `${shots}/10-mobile-responsive.png`, fullPage: true })
})

test('viewer permission controls are visibly and functionally restricted', async ({ page }) => {
  await login(page, 'viewer@fleet.demo')
  await page.getByRole('link', { name: 'Geofences' }).click()
  await expect(page.getByText('VIEWER demo role may view but cannot edit geofences.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Add geofence' })).toHaveCount(0)
  await page.screenshot({ path: `${shots}/08-access-denied.png`, fullPage: true })
})

test('API independently rejects a viewer geofence write', async ({ request }) => {
  const login = await request.post('http://localhost:5001/api/auth/login', { data: { email: 'viewer@fleet.demo', password: 'Demo@123' } })
  expect(login.ok()).toBeTruthy()
  const { token } = await login.json()
  const response = await request.post('http://localhost:5001/api/geofences', {
    headers: { authorization: `Bearer ${token}` },
    data: { name: 'Unauthorized Viewer Zone', type: 'DEPOT', center: 'Kochi', radius: 500 }
  })
  expect(response.status()).toBe(403)
  await expect(response.json()).resolves.toMatchObject({ message: expect.stringContaining('not authorized') })
})
