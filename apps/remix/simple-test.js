import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const REMIX_URL = 'http://localhost:3003'; // Update this port if needed
const PATHS = ['/', '/about', '/sample'];

// Create output directory
const outputDir = path.join(__dirname, 'test-results');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function testRoute(routePath) {
  console.log(`Testing route: ${routePath}`);
  
  try {
    // Test Remix
    const remixRes = await fetch(`${REMIX_URL}${routePath}`);
    const remixStatus = remixRes.status;
    const remixText = await remixRes.text();
    
    fs.writeFileSync(
      path.join(outputDir, `remix-${routePath.replace(/\//g, '-') || 'home'}.html`), 
      remixText
    );
    
    console.log(`  Remix: ${remixStatus}`);
    console.log(`  Remix size: ${remixText.length} bytes`);
    console.log(`  Remix has badge: ${remixText.includes('Remix')}`);
    
    return {
      path: routePath,
      remix: {
        status: remixStatus,
        size: remixText.length,
        hasBadge: remixText.includes('Remix')
      }
    };
  } catch (error) {
    console.error(`Error testing Remix route ${routePath}:`, error.message);
    return {
      path: routePath,
      remix: { error: error.message }
    };
  }
}

async function runTests() {
  console.log('Starting route tests...\n');
  
  const results = [];
  
  for (const pathItem of PATHS) {
    const result = await testRoute(pathItem);
    results.push(result);
    console.log(''); // Empty line for readability
  }
  
  // Write summary
  console.log('\nTest Results Summary:');
  console.log('====================');
  
  results.forEach(result => {
    console.log(`Path: ${result.path}`);
    
    if (result.remix.error) {
      console.log(`  Remix: Error - ${result.remix.error}`);
    } else {
      console.log(`  Remix: ${result.remix.status} OK (${result.remix.size} bytes)`);
      console.log(`  Remix has badge: ${result.remix.hasBadge ? 'Yes' : 'No'}`);
    }
    
    console.log('---');
  });
  
  console.log('\nTest results saved to:', outputDir);
}

runTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});