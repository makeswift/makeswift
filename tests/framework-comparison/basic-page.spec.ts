import { test, expect } from '@playwright/test';
import { navigateBoth, getPageByFramework } from './fixtures';
import { 
  compareVisually, 
  compareFunctionalBehavior, 
  compareContent,
  compareSEOElements 
} from './utils/compare';
import path from 'path';

// Define test paths that should exist in both Next.js and Remix apps
const TEST_PATHS = {
  HOME: '/',
  ABOUT: '/about',
  // Add more paths as you create matching pages in both apps
};

// Framework-specific selectors to ignore during comparison
const FRAMEWORK_SPECIFIC_SELECTORS = {
  nextjs: [
    // Next.js specific elements to ignore
    '[data-nextjs-data]',
    '[data-nextjs-router]',
    'script#__NEXT_DATA__',
    '#__next-build-watcher'
  ],
  remix: [
    // Remix specific elements to ignore
    'script[data-remix-run]',
    'script[async]' // This is too broad, but you can refine based on your app
  ]
};

test.describe('Framework Comparison - Basic Pages', () => {
  
  test('Home page looks the same in Next.js and Remix', async ({ page, browser }) => {
    // Create pages for both frameworks
    const nextjsContext = await browser.newContext({ baseURL: 'http://localhost:3000' });
    const remixContext = await browser.newContext({ baseURL: 'http://localhost:3001' });
    
    const nextjsPage = await nextjsContext.newPage();
    const remixPage = await remixContext.newPage();
    
    try {
      // Navigate to home page in both apps
      await Promise.all([
        nextjsPage.goto(TEST_PATHS.HOME),
        remixPage.goto(TEST_PATHS.HOME)
      ]);
      
      // Wait for network idle in both
      await Promise.all([
        nextjsPage.waitForLoadState('networkidle'),
        remixPage.waitForLoadState('networkidle') 
      ]);
      
      // Compare SEO elements
      await compareSEOElements(nextjsPage, remixPage);
      
      // Compare visible content
      await compareContent(nextjsPage, remixPage, 'main');
      
      // Visually compare the main content
      await compareVisually(nextjsPage, remixPage, 'main', {
        threshold: 0.1, // 10% tolerance
        screenshotName: 'home-main-content',
        ignoreSelectors: [
          ...FRAMEWORK_SPECIFIC_SELECTORS.nextjs,
          ...FRAMEWORK_SPECIFIC_SELECTORS.remix,
          // Add page-specific elements to ignore
          '.timestamp', // Example: dynamically generated timestamps
          '.framework-badge' // Example: framework-specific badges
        ]
      });
      
      // Test navigation behavior (clicking a link)
      await compareFunctionalBehavior(
        nextjsPage,
        remixPage,
        async (page) => {
          // Example: click a navigation link that should go to About page
          await page.click('a[href="/about"]');
        },
        {
          expectedUrl: '/about',
          waitTime: 1000 // Wait 1s for navigation to complete
        }
      );
      
    } finally {
      // Clean up
      await nextjsPage.close();
      await remixPage.close();
      await nextjsContext.close();
      await remixContext.close();
    }
  });
  
  test('Interactive elements behave the same in both frameworks', async ({ page, browser }) => {
    // Create pages for both frameworks
    const nextjsContext = await browser.newContext({ baseURL: 'http://localhost:3000' });
    const remixContext = await browser.newContext({ baseURL: 'http://localhost:3001' });
    
    const nextjsPage = await nextjsContext.newPage();
    const remixPage = await remixContext.newPage();
    
    try {
      // Navigate to home page in both apps
      await Promise.all([
        nextjsPage.goto(TEST_PATHS.HOME),
        remixPage.goto(TEST_PATHS.HOME)
      ]);
      
      // Wait for network idle in both
      await Promise.all([
        nextjsPage.waitForLoadState('networkidle'),
        remixPage.waitForLoadState('networkidle') 
      ]);
      
      // Test button click behavior
      await compareFunctionalBehavior(
        nextjsPage,
        remixPage,
        async (page) => {
          // Example: click a button that shows a modal
          await page.click('button.show-modal');
        },
        {
          visibilitySelector: '.modal',
          waitTime: 500
        }
      );
      
      // Compare the modal content visually
      await compareVisually(nextjsPage, remixPage, '.modal', {
        threshold: 0.05, // Stricter comparison for modals (5%)
        screenshotName: 'modal-content'
      });
      
      // Test closing the modal
      await compareFunctionalBehavior(
        nextjsPage,
        remixPage,
        async (page) => {
          // Close the modal
          await page.click('.modal-close');
        },
        {
          waitTime: 500
        }
      );
      
      // Verify modal is hidden in both
      const nextjsModalVisible = await nextjsPage.isVisible('.modal');
      const remixModalVisible = await remixPage.isVisible('.modal');
      
      expect(nextjsModalVisible).toBe(false);
      expect(remixModalVisible).toBe(false);
      
    } finally {
      // Clean up
      await nextjsPage.close();
      await remixPage.close();
      await nextjsContext.close();
      await remixContext.close();
    }
  });
  
  test('Responsive behavior matches across frameworks', async ({ browser }) => {
    // Test with different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      // Create contexts with specific viewport size
      const nextjsContext = await browser.newContext({ 
        baseURL: 'http://localhost:3000',
        viewport: viewport
      });
      
      const remixContext = await browser.newContext({ 
        baseURL: 'http://localhost:3001',
        viewport: viewport
      });
      
      const nextjsPage = await nextjsContext.newPage();
      const remixPage = await remixContext.newPage();
      
      try {
        // Navigate to home page
        await Promise.all([
          nextjsPage.goto(TEST_PATHS.HOME),
          remixPage.goto(TEST_PATHS.HOME)
        ]);
        
        // Wait for load
        await Promise.all([
          nextjsPage.waitForLoadState('networkidle'),
          remixPage.waitForLoadState('networkidle')
        ]);
        
        // Compare visually with viewport-specific name
        await compareVisually(nextjsPage, remixPage, 'main', {
          threshold: 0.1,
          screenshotName: `home-${viewport.name}`,
          ignoreSelectors: [
            ...FRAMEWORK_SPECIFIC_SELECTORS.nextjs,
            ...FRAMEWORK_SPECIFIC_SELECTORS.remix
          ]
        });
        
      } finally {
        // Clean up
        await nextjsPage.close();
        await remixPage.close();
        await nextjsContext.close();
        await remixContext.close();
      }
    }
  });
});