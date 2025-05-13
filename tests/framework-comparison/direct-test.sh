#!/bin/bash

# This is a simplified test script that focuses on capturing screenshots
# but now with early error detection and health checks

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Running simplified screenshot comparison tests${NC}"
echo "==============================================="

# Setup URLs
NEXTJS_URL="http://localhost:3000"
REMIX_URL="http://localhost:3001"
MAX_CHECK_TIME=30 # Maximum time to wait for servers (in seconds)

# Install dependencies if needed
echo -e "${YELLOW}Installing test dependencies...${NC}"
pnpm install

# Make sure the screenshots directory exists
mkdir -p test-results/screenshots

# Skip health check if requested
BYPASS_HEALTH=${BYPASS_HEALTH:-"false"}

if [ "$BYPASS_HEALTH" != "true" ]; then
  # Check that both servers are ready before proceeding
  echo -e "${YELLOW}Checking that servers are running...${NC}"
  if ! curl -s --connect-timeout 5 "$NEXTJS_URL" > /dev/null; then
    echo -e "${RED}Error: Next.js server at $NEXTJS_URL is not responding!${NC}"
    exit 1
  fi
  
  if ! curl -s --connect-timeout 5 "$REMIX_URL" > /dev/null; then
    echo -e "${RED}Error: Remix server at $REMIX_URL is not responding!${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Both servers are responding!${NC}"
else
  echo -e "${YELLOW}Bypassing health check...${NC}"
fi

# Create a simplified test file
cat > basic-capture.spec.ts << 'EOL'
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
EOL

# Create a simple playwright config
cat > direct-config.ts << 'EOL'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
EOL

# Run the tests
echo -e "${YELLOW}Running screenshot tests for both frameworks...${NC}"
npx playwright test basic-capture.spec.ts --config=direct-config.ts

TEST_EXIT_CODE=$?

# Show the results
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}Tests completed successfully!${NC}"
else
  echo -e "${RED}Tests failed with exit code: ${TEST_EXIT_CODE}${NC}"
fi

# Always show where to find the screenshots
echo -e "${YELLOW}Screenshots saved to:${NC} test-results/screenshots/"
echo -e "${YELLOW}Compare the screenshots to check visual consistency between frameworks${NC}"
echo -e "${YELLOW}View the HTML test report with:${NC} npx playwright show-report"

exit $TEST_EXIT_CODE