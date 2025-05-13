
// Simple script to check for errors on the page
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Collect console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  
  // Collect JavaScript errors
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  try {
    // Go to the page
    await page.goto('http://localhost:4175/');
    
    // Wait a bit for any async errors
    await new Promise(r => setTimeout(r, 2000));
    
    // Get the HTML content
    const html = await page.content();
    console.log('\nHTML CONTENT (first 500 chars):\n', html.substring(0, 500));
    
    // Check if there is an error text on the page
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes('Error')) {
      console.log('\nERROR FOUND IN PAGE TEXT:', bodyText);
    }
  } catch (e) {
    console.error('Script error:', e);
  } finally {
    await browser.close();
  }
})();

