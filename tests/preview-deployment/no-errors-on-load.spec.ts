import { test, expect } from '@playwright/test'

test('should have no errors in the console', async ({ page }) => {
  // Arrange
  const consoleErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  // Act
  await page.goto('/')

  // Assert
  expect(consoleErrors).toHaveLength(0)
})
