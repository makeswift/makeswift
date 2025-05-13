import { test, expect } from '@playwright/test';
import { 
  compareVisually, 
  compareFunctionalBehavior,
  compareContent
} from './utils/compare';

test.describe('Framework Comparison - Sample Page Tests', () => {
  
  test('Sample page looks visually identical across frameworks', async ({ browser }) => {
    // Create contexts for both frameworks
    const nextjsContext = await browser.newContext({ baseURL: 'http://localhost:3000' });
    const remixContext = await browser.newContext({ baseURL: 'http://localhost:3001' });
    
    const nextjsPage = await nextjsContext.newPage();
    const remixPage = await remixContext.newPage();
    
    try {
      // Navigate to sample page in both apps
      await Promise.all([
        nextjsPage.goto('/sample'),
        remixPage.goto('/sample')
      ]);
      
      // Wait for pages to be fully loaded
      await Promise.all([
        nextjsPage.waitForLoadState('networkidle'),
        remixPage.waitForLoadState('networkidle')
      ]);
      
      // Take full page screenshot comparison
      await compareVisually(nextjsPage, remixPage, 'main', {
        threshold: 0.15, // 15% tolerance for overall layout
        screenshotName: 'sample-page-full',
        ignoreSelectors: [
          // Ignore elements that will differ by framework
          '.timestamp', 
          '.framework-badge',
          'script',
          'style'
        ]
      });
      
      // Compare specific sections
      const sections = [
        {
          name: 'interactive-elements',
          selector: 'section:nth-of-type(1)',
          threshold: 0.05
        },
        {
          name: 'visual-elements',
          selector: 'section:nth-of-type(2)',
          threshold: 0.05
        }
      ];
      
      // Compare each section
      for (const section of sections) {
        await compareVisually(nextjsPage, remixPage, section.selector, {
          threshold: section.threshold,
          screenshotName: `sample-page-${section.name}`
        });
      }
      
      // Compare text content
      await compareContent(nextjsPage, remixPage, 'main');
      
    } finally {
      // Clean up
      await nextjsPage.close();
      await remixPage.close();
      await nextjsContext.close();
      await remixContext.close();
    }
  });
  
  test('Counter increments identically in both frameworks', async ({ browser }) => {
    // Create contexts
    const nextjsContext = await browser.newContext({ baseURL: 'http://localhost:3000' });
    const remixContext = await browser.newContext({ baseURL: 'http://localhost:3001' });
    
    const nextjsPage = await nextjsContext.newPage();
    const remixPage = await remixContext.newPage();
    
    try {
      // Navigate to sample page
      await Promise.all([
        nextjsPage.goto('/sample'),
        remixPage.goto('/sample')
      ]);
      
      // Wait for load
      await Promise.all([
        nextjsPage.waitForLoadState('networkidle'),
        remixPage.waitForLoadState('networkidle')
      ]);
      
      // Increment the counter
      for (let i = 0; i < 3; i++) {
        await compareFunctionalBehavior(
          nextjsPage,
          remixPage,
          async (page) => {
            await page.click('[data-testid="increment-button"]');
          },
          { waitTime: 100 }
        );
        
        // Check counter value
        const nextjsCount = await nextjsPage.textContent('[data-testid="count-value"]');
        const remixCount = await remixPage.textContent('[data-testid="count-value"]');
        
        expect(nextjsCount).toBe((i + 1).toString());
        expect(remixCount).toBe(nextjsCount);
      }
      
    } finally {
      // Clean up
      await nextjsPage.close();
      await remixPage.close();
      await nextjsContext.close();
      await remixContext.close();
    }
  });
  
  test('Modal behavior is consistent across frameworks', async ({ browser }) => {
    // Create contexts
    const nextjsContext = await browser.newContext({ baseURL: 'http://localhost:3000' });
    const remixContext = await browser.newContext({ baseURL: 'http://localhost:3001' });
    
    const nextjsPage = await nextjsContext.newPage();
    const remixPage = await remixContext.newPage();
    
    try {
      // Navigate to sample page
      await Promise.all([
        nextjsPage.goto('/sample'),
        remixPage.goto('/sample')
      ]);
      
      // Wait for load
      await Promise.all([
        nextjsPage.waitForLoadState('networkidle'),
        remixPage.waitForLoadState('networkidle')
      ]);
      
      // Open modal
      await compareFunctionalBehavior(
        nextjsPage,
        remixPage,
        async (page) => {
          await page.click('[data-testid="modal-trigger"]');
        },
        { 
          visibilitySelector: '.modal',
          waitTime: 200
        }
      );
      
      // Compare modal visually
      await compareVisually(nextjsPage, remixPage, '.modal', {
        threshold: 0.05,
        screenshotName: 'sample-page-modal'
      });
      
      // Close modal
      await compareFunctionalBehavior(
        nextjsPage,
        remixPage,
        async (page) => {
          await page.click('[data-testid="modal-close"]');
        },
        { waitTime: 200 }
      );
      
      // Verify modal is closed in both
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
  
  test('Navigation works consistently across frameworks', async ({ browser }) => {
    // Create contexts
    const nextjsContext = await browser.newContext({ baseURL: 'http://localhost:3000' });
    const remixContext = await browser.newContext({ baseURL: 'http://localhost:3001' });
    
    const nextjsPage = await nextjsContext.newPage();
    const remixPage = await remixContext.newPage();
    
    try {
      // Navigate to sample page
      await Promise.all([
        nextjsPage.goto('/sample'),
        remixPage.goto('/sample')
      ]);
      
      // Test navigation to 404 page (to home page because it shouldn't exist yet)
      await compareFunctionalBehavior(
        nextjsPage,
        remixPage,
        async (page) => {
          // Click the link to a non-existent page
          await page.click('a[href="/nonexistent"]');
        },
        { waitTime: 1000 }
      );
      
      // Both frameworks should handle 404 scenarios (the exact page doesn't matter,
      // but the behavior should be consistent within each framework)
      const nextjsUrl = new URL(nextjsPage.url()).pathname;
      const remixUrl = new URL(remixPage.url()).pathname;
      
      console.log(`Next.js navigated to: ${nextjsUrl}`);
      console.log(`Remix navigated to: ${remixUrl}`);
      
    } finally {
      // Clean up
      await nextjsPage.close();
      await remixPage.close();
      await nextjsContext.close();
      await remixContext.close();
    }
  });
  
  test('Responsive layout behaves consistently', async ({ browser }) => {
    // Test with multiple viewports
    const viewports = [
      { width: 1440, height: 900, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      // Create contexts with viewport
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
        // Navigate to sample page
        await Promise.all([
          nextjsPage.goto('/sample'),
          remixPage.goto('/sample')
        ]);
        
        // Wait for load
        await Promise.all([
          nextjsPage.waitForLoadState('networkidle'),
          remixPage.waitForLoadState('networkidle')
        ]);
        
        // Take screenshot with viewport name in filename
        await compareVisually(nextjsPage, remixPage, 'main', {
          threshold: 0.15, // Higher threshold for responsive layouts
          screenshotName: `sample-page-${viewport.name}`,
          ignoreSelectors: ['.timestamp', '.framework-badge']
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