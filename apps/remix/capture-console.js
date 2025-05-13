import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  // Store logs, errors, and warnings
  const logs = [];
  const errors = [];
  const warnings = [];
  
  // Create a page and start listening to console events
  const page = await context.newPage();
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      errors.push(text);
      console.error(`BROWSER ERROR: ${text}`);
    } else if (type === 'warning') {
      warnings.push(text);
      console.warn(`BROWSER WARNING: ${text}`);
    } else {
      logs.push(text);
      console.log(`BROWSER LOG: ${text}`);
    }
  });
  
  page.on('pageerror', err => {
    console.error(`PAGE ERROR: ${err}`);
    errors.push(err.toString());
  });
  
  // Navigate to the page
  await page.goto('http://localhost:3000/');
  console.log('Loaded homepage');
  
  // Wait to ensure scripts run
  await page.waitForTimeout(2000);
  
  // Try other routes
  await page.goto('http://localhost:3000/en');
  console.log('Loaded /en page');
  await page.waitForTimeout(2000);
  
  await page.goto('http://localhost:3000/sample');
  console.log('Loaded /sample page');
  await page.waitForTimeout(2000);
  
  // Check a non-existent route
  await page.goto('http://localhost:3000/nonexistent-page');
  console.log('Loaded non-existent page');
  await page.waitForTimeout(2000);
  
  // Summary
  console.log('\n----- SUMMARY -----');
  
  if (errors.length > 0) {
    console.log(`\n${errors.length} ERRORS:`);
    errors.forEach((err, i) => console.log(`${i+1}. ${err}`));
  } else {
    console.log('No errors detected! 🎉');
  }
  
  if (warnings.length > 0) {
    console.log(`\n${warnings.length} WARNINGS:`);
    warnings.forEach((warn, i) => console.log(`${i+1}. ${warn}`));
  }
  
  await browser.close();
})().catch(err => {
  console.error('Failed to run tests:', err);
  process.exit(1);
});