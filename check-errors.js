const { chromium } = require('@playwright/test');

async function checkPage() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  // Store console logs
  const logs = [];
  context.on('console', msg => {
    logs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Store page errors
  const errors = [];
  context.on('pageerror', exception => {
    errors.push(exception.toString());
  });

  const page = await context.newPage();
  
  try {
    // Navigate to the page
    console.log('Navigating to http://localhost:4175/...');
    await page.goto('http://localhost:4175/', { timeout: 30000 });
    
    // Take a screenshot
    await page.screenshot({ path: 'page-screenshot.png' });
    
    // Get page HTML
    const html = await page.content();
    
    // Look for React error boundaries
    const errorBoundaries = await page.$$eval('[data-error-boundary]', elements => {
      return elements.map(el => ({
        text: el.innerText,
        html: el.innerHTML
      }));
    });

    // Get visible text on the page
    const pageText = await page.textContent('body');
    
    // Output results
    console.log('\n--- CONSOLE LOGS ---');
    console.log(JSON.stringify(logs, null, 2));
    
    console.log('\n--- PAGE ERRORS ---');
    console.log(JSON.stringify(errors, null, 2));
    
    console.log('\n--- ERROR BOUNDARIES ---');
    console.log(JSON.stringify(errorBoundaries, null, 2));
    
    console.log('\n--- PAGE TEXT (FIRST 1000 CHARS) ---');
    console.log(pageText.substring(0, 1000));
    
    console.log('\n--- PAGE HTML (FIRST 1000 CHARS) ---');
    console.log(html.substring(0, 1000));
    
    // Write full HTML to file for analysis
    require('fs').writeFileSync('page_output.html', html);
    console.log('\nFull HTML written to page_output.html');
  } catch (error) {
    console.error('Error during page check:', error);
  } finally {
    await browser.close();
  }
}

checkPage().catch(console.error);