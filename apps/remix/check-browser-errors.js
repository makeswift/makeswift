import { chromium } from 'playwright';

async function checkForErrors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Store all console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // Store all uncaught exceptions
  const exceptions = [];
  page.on('pageerror', exception => {
    exceptions.push(exception.message);
  });
  
  // Navigate to the page
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  
  // Wait a bit to ensure all scripts have executed
  await page.waitForTimeout(2000);
  
  // Print any errors
  if (errors.length > 0) {
    console.log('Console errors:');
    errors.forEach(err => console.log(`- ${err}`));
  } else {
    console.log('No console errors detected');
  }
  
  if (exceptions.length > 0) {
    console.log('Uncaught exceptions:');
    exceptions.forEach(ex => console.log(`- ${ex}`));
  } else {
    console.log('No uncaught exceptions detected');
  }
  
  // Take a screenshot for visual inspection
  await page.screenshot({ path: 'page-screenshot.png' });
  console.log('Screenshot saved as page-screenshot.png');
  
  // Get page title
  const title = await page.title();
  console.log(`Page title: ${title}`);
  
  // Get and print some info about what's rendered on the page
  const content = await page.content();
  console.log(`Page contains Makeswift: ${content.includes('makeswift') || content.includes('Makeswift')}`);
  
  await browser.close();
}

checkForErrors().catch(console.error);