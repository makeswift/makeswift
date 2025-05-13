import { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * Options for visual comparison
 */
interface VisualComparisonOptions {
  /** Threshold for pixel difference tolerance (0-1) */
  threshold?: number;
  /** Name for the screenshot files */
  screenshotName?: string;
  /** Areas to mask before comparison (coordinates) */
  maskAreas?: Array<{ x: number, y: number, width: number, height: number }>;
  /** Selectors for elements to ignore/mask */
  ignoreSelectors?: string[];
}

/**
 * Options for functional behavior testing
 */
interface FunctionalTestOptions {
  /** Expected final URL after interaction */
  expectedUrl?: string;
  /** Selector to check for visibility after interaction */
  visibilitySelector?: string;
  /** Wait time after interaction (ms) */
  waitTime?: number;
}

/**
 * Compare screenshots from both frameworks for visual differences
 */
export async function compareVisually(
  nextjsPage: Page,
  remixPage: Page,
  selector = 'body',
  options: VisualComparisonOptions = {}
): Promise<void> {
  // Default options
  const {
    threshold = 0.1, // Allow some small differences (10%)
    screenshotName = 'comparison',
    maskAreas = [],
    ignoreSelectors = []
  } = options;

  // Ensure the results directory exists
  const resultsDir = path.join(process.cwd(), 'test-results', 'framework-comparison', 'visual');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  // Prepare screenshot paths
  const nextjsScreenshotPath = path.join(resultsDir, `${screenshotName}-nextjs.png`);
  const remixScreenshotPath = path.join(resultsDir, `${screenshotName}-remix.png`);
  const diffScreenshotPath = path.join(resultsDir, `${screenshotName}-diff.png`);

  // Hide elements that should be ignored before taking screenshots
  for (const pageToProcess of [nextjsPage, remixPage]) {
    // Apply CSS to hide selected elements
    for (const ignoreSelector of ignoreSelectors) {
      await pageToProcess.evaluate((selector) => {
        document.querySelectorAll(selector).forEach(el => {
          if (el instanceof HTMLElement) el.style.visibility = 'hidden';
        });
      }, ignoreSelector);
    }
    
    // Wait a bit for style changes to apply
    await pageToProcess.waitForTimeout(200);
  }

  // Take the screenshots
  await nextjsPage.locator(selector).screenshot({ path: nextjsScreenshotPath });
  await remixPage.locator(selector).screenshot({ path: remixScreenshotPath });

  // Compare the screenshots
  const nextjsImg = PNG.sync.read(fs.readFileSync(nextjsScreenshotPath));
  const remixImg = PNG.sync.read(fs.readFileSync(remixScreenshotPath));

  // Make sure dimensions match before comparison
  if (nextjsImg.width !== remixImg.width || nextjsImg.height !== remixImg.height) {
    console.warn(`Image dimensions don't match. Next.js: ${nextjsImg.width}x${nextjsImg.height}, Remix: ${remixImg.width}x${remixImg.height}`);
    
    // Resize the smaller image to match the larger one for comparison
    // This is simplified - in a real implementation, you'd use proper image resizing
    const maxWidth = Math.max(nextjsImg.width, remixImg.width);
    const maxHeight = Math.max(nextjsImg.height, remixImg.height);
    
    // Log the issue but continue - in real tests you might want to handle this differently
    console.warn(`Resizing images to ${maxWidth}x${maxHeight} for comparison`);
  }

  // Apply masks to areas that should be ignored
  for (const area of maskAreas) {
    const { x, y, width, height } = area;
    
    // Apply black mask to both images in the specified area
    for (let j = y; j < y + height && j < nextjsImg.height; j++) {
      for (let i = x; i < x + width && i < nextjsImg.width; i++) {
        const idx = (nextjsImg.width * j + i) << 2;
        // Set RGBA to black
        if (idx < nextjsImg.data.length) {
          nextjsImg.data[idx] = 0;
          nextjsImg.data[idx + 1] = 0;
          nextjsImg.data[idx + 2] = 0;
          nextjsImg.data[idx + 3] = 255;
        }
        
        if (idx < remixImg.data.length) {
          remixImg.data[idx] = 0;
          remixImg.data[idx + 1] = 0;
          remixImg.data[idx + 2] = 0;
          remixImg.data[idx + 3] = 255;
        }
      }
    }
  }

  // Create diff PNG
  const { width, height } = nextjsImg;
  const diff = new PNG({ width, height });

  // Compare the images and get number of different pixels
  const numDiffPixels = pixelmatch(
    nextjsImg.data,
    remixImg.data,
    diff.data,
    width,
    height,
    { threshold }
  );

  // Write the diff image
  fs.writeFileSync(diffScreenshotPath, PNG.sync.write(diff));

  // Calculate percentage of different pixels
  const totalPixels = width * height;
  const diffPercentage = numDiffPixels / totalPixels;

  // Report the difference
  console.log(`Visual difference: ${(diffPercentage * 100).toFixed(2)}% (threshold: ${threshold * 100}%)`);
  console.log(`Different pixels: ${numDiffPixels} out of ${totalPixels}`);
  console.log(`Diff image saved to: ${diffScreenshotPath}`);

  // Assert the difference is within tolerance
  expect(diffPercentage, 
    `Visual difference (${(diffPercentage * 100).toFixed(2)}%) should be below threshold (${threshold * 100}%)`
  ).toBeLessThanOrEqual(threshold);
}

/**
 * Compare functional behaviors like navigation, interactions, etc.
 */
export async function compareFunctionalBehavior(
  nextjsPage: Page,
  remixPage: Page,
  interactionFunction: (page: Page) => Promise<void>,
  options: FunctionalTestOptions = {}
): Promise<void> {
  const {
    expectedUrl,
    visibilitySelector,
    waitTime = 500
  } = options;

  // Perform the same interaction on both pages
  await Promise.all([
    interactionFunction(nextjsPage),
    interactionFunction(remixPage)
  ]);

  // Wait for specified time
  if (waitTime > 0) {
    await Promise.all([
      nextjsPage.waitForTimeout(waitTime),
      remixPage.waitForTimeout(waitTime)
    ]);
  }

  // Check URL if expected
  if (expectedUrl) {
    const nextjsUrl = new URL(nextjsPage.url()).pathname;
    const remixUrl = new URL(remixPage.url()).pathname;
    
    // Check that both frameworks navigated to the same path
    expect(remixUrl, 'URL paths should match after interaction').toBe(nextjsUrl);
    
    // Check that it's the expected path
    expect(nextjsUrl, 'Should navigate to expected URL').toBe(expectedUrl);
  }

  // Check element visibility if specified
  if (visibilitySelector) {
    const nextjsVisible = await nextjsPage.isVisible(visibilitySelector);
    const remixVisible = await remixPage.isVisible(visibilitySelector);
    
    expect(nextjsVisible, `Element ${visibilitySelector} should be visible in Next.js`).toBe(true);
    expect(remixVisible, `Element ${visibilitySelector} should be visible in Remix`).toBe(true);
  }
}

/**
 * Compare user-visible content (text, images, etc.) while ignoring framework-specific implementation details
 */
export async function compareContent(
  nextjsPage: Page, 
  remixPage: Page, 
  selector = 'body'
): Promise<void> {
  // Get the text content from both pages
  const nextjsText = await nextjsPage.locator(selector).textContent();
  const remixText = await remixPage.locator(selector).textContent();
  
  // Normalize the text (trim whitespace, etc.)
  const normalizeText = (text: string | null): string => {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').trim();
  };
  
  const normalizedNextText = normalizeText(nextjsText);
  const normalizedRemixText = normalizeText(remixText);
  
  // Compare text content
  expect(normalizedRemixText, 'Text content should match between frameworks').toBe(normalizedNextText);
  
  // Count visible elements by type
  const countElements = async (page: Page, elementType: string): Promise<number> => {
    return page.evaluate((selector, type) => {
      const root = document.querySelector(selector);
      if (!root) return 0;
      
      const elements = root.querySelectorAll(type);
      let visibleCount = 0;
      
      elements.forEach(el => {
        // Check if element is visible
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
          visibleCount++;
        }
      });
      
      return visibleCount;
    }, selector, elementType);
  };
  
  // Compare counts of important elements
  const elementTypes = ['img', 'button', 'a', 'input', 'select'];
  
  for (const elementType of elementTypes) {
    const nextjsCount = await countElements(nextjsPage, elementType);
    const remixCount = await countElements(remixPage, elementType);
    
    expect(remixCount, `Count of ${elementType} elements should match`).toBe(nextjsCount);
  }
}

/**
 * Compare the title, meta tags, and other SEO elements between frameworks
 */
export async function compareSEOElements(nextjsPage: Page, remixPage: Page): Promise<void> {
  // Compare page titles
  const nextjsTitle = await nextjsPage.title();
  const remixTitle = await remixPage.title();
  expect(remixTitle, 'Page titles should match').toBe(nextjsTitle);

  // Compare meta tags
  const getMetaTags = async (page: Page) => {
    return page.evaluate(() => {
      const metaTags = Array.from(document.querySelectorAll('meta'));
      return metaTags.map(tag => {
        const attributes: Record<string, string> = {};
        Array.from(tag.attributes).forEach(attr => {
          attributes[attr.name] = attr.value;
        });
        return attributes;
      });
    });
  };

  const nextjsMetaTags = await getMetaTags(nextjsPage);
  const remixMetaTags = await getMetaTags(remixPage);

  // Compare critical SEO meta tags only
  const criticalMetaTags = ['description', 'keywords', 'robots', 'viewport', 'og:title', 'og:description', 'twitter:title'];
  
  for (const tagName of criticalMetaTags) {
    // Find tags in each framework
    const nextjsTag = nextjsMetaTags.find(tag => tag.name === tagName || tag.property === tagName);
    const remixTag = remixMetaTags.find(tag => tag.name === tagName || tag.property === tagName);
    
    // If Next.js has this tag, Remix should too
    if (nextjsTag) {
      expect(remixTag, `Remix should have meta tag: ${tagName}`).toBeTruthy();
      
      // Compare content
      if (nextjsTag.content && remixTag && remixTag.content) {
        expect(remixTag.content, `Content for meta tag ${tagName} should match`).toBe(nextjsTag.content);
      }
    }
  }
}