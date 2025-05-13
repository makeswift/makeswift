import { test as base, Browser, BrowserContext, Page } from '@playwright/test';
import { FullConfig } from '@playwright/test/reporter';

// A structure to hold paired pages for comparison
interface FrameworkPair {
  nextjsPage: Page;
  remixPage: Page;
  nextjsContext: BrowserContext;
  remixContext: BrowserContext;
}

// Extend the base test with the framework pair
export const test = base.extend<{ frameworkPair: FrameworkPair }>({
  // Create a fixture that provides paired browser contexts and pages
  frameworkPair: async ({ browser }, use) => {
    // Create contexts for both frameworks
    const nextjsContext = await browser.newContext({
      baseURL: 'http://localhost:3000',
    });
    
    const remixContext = await browser.newContext({
      baseURL: 'http://localhost:3001',
    });
    
    // Create pages for both frameworks
    const nextjsPage = await nextjsContext.newPage();
    const remixPage = await remixContext.newPage();
    
    // Use the paired pages
    await use({ 
      nextjsPage, 
      remixPage, 
      nextjsContext, 
      remixContext 
    });
    
    // Clean up
    await nextjsPage.close();
    await remixPage.close();
    await nextjsContext.close();
    await remixContext.close();
  }
});

// Export the expect function
export { expect } from '@playwright/test';

/**
 * Helper function to navigate to the same page in both frameworks
 */
export async function navigateBoth(
  pair: FrameworkPair, 
  path: string
): Promise<void> {
  // Navigate to the same path in both frameworks
  await Promise.all([
    pair.nextjsPage.goto(path),
    pair.remixPage.goto(path)
  ]);
  
  // Wait for both pages to be fully loaded
  await Promise.all([
    pair.nextjsPage.waitForLoadState('networkidle'),
    pair.remixPage.waitForLoadState('networkidle')
  ]);
}

/**
 * Helper to get framework-specific page
 */
export function getPageByFramework(
  pair: FrameworkPair,
  framework: 'nextjs' | 'remix'
): Page {
  return framework === 'nextjs' ? pair.nextjsPage : pair.remixPage;
}

/**
 * Global setup function to ensure both servers are ready
 */
export async function globalSetup(config: FullConfig) {
  // This would contain any global setup logic needed before tests run
  console.log('Setting up framework comparison tests...');
  
  // You could add health check logic here to ensure both servers are running
}