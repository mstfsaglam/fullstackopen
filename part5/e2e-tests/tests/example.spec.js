const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog App', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const title = page.getByText('log in to application')
    await expect(title).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    const password = page.getByText('password')
    await expect(password).toBeVisible()
  })
})