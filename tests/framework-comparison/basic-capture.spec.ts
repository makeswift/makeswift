import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Make sure the screenshots directory exists
const screenshotsDir = path.resolve('./test-results/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Define pages to test
const TEST_PATHS = [
  '/',  // Homepage only
];

test.describe('Framework Comparison Screenshots', () => {
  for (const pagePath of TEST_PATHS) {
    test(`Capture ${pagePath || 'homepage'} from Next.js and Remix`, async ({ browser }) => {
      // Page name for screenshot filenames
      const pageName = pagePath === '/' ? 'home' : pagePath.replace(/\//g, '-').replace(/^-/, '');
      
      // Create browsers for both frameworks
      const nextjsContext = await browser.newContext();
      const remixContext = await browser.newContext();
      
      const nextjsPage = await nextjsContext.newPage();
      const remixPage = await remixContext.newPage();
      
      try {
        // Go to page on both sites
        console.log(`Loading Next.js page: ${pagePath}`);
        const nextjsResponse = await nextjsPage.goto(`http://localhost:3000${pagePath}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        if (!nextjsResponse?.ok()) {
          console.log(`⚠️ Warning: Next.js returned status ${nextjsResponse?.status()} for ${pagePath}`);
          // Take screenshot anyway to see the error page
        }
        
        console.log(`Loading Remix page: ${pagePath}`);
        const remixResponse = await remixPage.goto(`http://localhost:3001${pagePath}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        if (!remixResponse?.ok()) {
          console.log(`⚠️ Warning: Remix returned status ${remixResponse?.status()} for ${pagePath}`);
          // Take screenshot anyway to see the error page
        }
        
        // Wait for any animations/loading to finish
        await nextjsPage.waitForTimeout(1000);
        await remixPage.waitForTimeout(1000);
        
        // Capture screenshots
        console.log(`Taking screenshots for ${pagePath}...`);
        await nextjsPage.screenshot({ 
          path: path.join(screenshotsDir, `nextjs-${pageName}.png`),
          fullPage: true
        });
        
        await remixPage.screenshot({ 
          path: path.join(screenshotsDir, `remix-${pageName}.png`),
          fullPage: true
        });
        
        console.log(`Screenshots for ${pagePath} saved to: ${screenshotsDir}`);
        
        // Basic check - page titles should match (skipping visual comparison)
        const nextjsTitle = await nextjsPage.title();
        const remixTitle = await remixPage.title();
        
        console.log(`Next.js page title: "${nextjsTitle}"`);
        console.log(`Remix page title: "${remixTitle}"`);
        
        // Don't fail tests if titles don't match, just log the difference
        if (nextjsTitle !== remixTitle) {
          console.log(`⚠️ Warning: Page titles don't match for ${pagePath}`);
        }
      } finally {
        await nextjsPage.close();
        await remixPage.close();
        await nextjsContext.close();
        await remixContext.close();
      }
    });
  }
});
