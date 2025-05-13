/**
 * Test script to check Makeswift content rendering
 */
import http from 'http';
import fs from 'fs';

// Function to make HTTP request and save response
async function testUrl(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`Testing URL: ${url}`);
    
    http.get(url, (res) => {
      const { statusCode } = res;
      console.log(`Status code: ${statusCode}`);
      
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      
      res.on('end', () => {
        try {
          // Save response to file for inspection
          fs.writeFileSync(outputPath, rawData);
          console.log(`Response saved to ${outputPath}`);
          
          // Check for error indicators
          const hasError = rawData.includes('Error Rendering Page') || 
                          rawData.includes('require is not defined');
          
          // Check for Makeswift content indicators
          const hasMakeswiftContent = rawData.includes('makeswift-page-container') || 
                                     rawData.includes('content-card');
          
          resolve({
            url,
            statusCode,
            hasError,
            hasMakeswiftContent,
            contentLength: rawData.length
          });
        } catch (e) {
          console.error(`Error processing response: ${e.message}`);
          resolve({
            url,
            statusCode,
            error: e.message
          });
        }
      });
    }).on('error', (err) => {
      console.error(`Error requesting ${url}: ${err.message}`);
      resolve({
        url,
        error: err.message
      });
    });
  });
}

// Main test function
async function runTests() {
  console.log('Testing Makeswift content rendering...');
  
  // Ensure server is running on port 3010 (from earlier output)
  const baseUrl = 'http://localhost:3010';
  const outputDir = '/tmp/makeswift-tests';
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Test different routes
  const routes = [
    '/',
    '/about',
    '/sample'
  ];
  
  const results = [];
  
  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    const outputPath = `${outputDir}${route.replace('/', '_')}.html`;
    const result = await testUrl(url, outputPath);
    results.push(result);
    console.log('');
  }
  
  // Print summary
  console.log('\nTest Results Summary:');
  console.log('=====================');
  
  for (const result of results) {
    console.log(`URL: ${result.url}`);
    console.log(`Status: ${result.error ? 'Error' : result.statusCode}`);
    if (result.error) {
      console.log(`Error: ${result.error}`);
    } else {
      console.log(`Content Length: ${result.contentLength} bytes`);
      console.log(`Has Errors: ${result.hasError ? 'Yes' : 'No'}`);
      console.log(`Has Makeswift Content: ${result.hasMakeswiftContent ? 'Yes' : 'No'}`);
    }
    console.log('---------------------');
  }
  
  console.log('\nTest complete! Check the HTML files in the output directory for details.');
}

// Run the tests
runTests();