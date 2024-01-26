import { test, expect } from '@playwright/test'

test('Hello World test', async ({ page }) => {
  await page.goto('/hello-world-app')
  let heading = await page.locator('h1')
  const appFontWeight = await heading.evaluate((element) => {
    return window.getComputedStyle(element).fontWeight
  })
  await page.goto('/hello-world-page')
  heading = await page.locator('h1')
  const pageFontWeight = await heading.evaluate((element) => {
    return window.getComputedStyle(element).fontWeight
  })
  expect(pageFontWeight).toBe(appFontWeight)
})
