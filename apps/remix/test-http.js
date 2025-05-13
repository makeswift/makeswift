/**
 * Test script to verify the HTTP status codes for different routes
 */
import http from 'http';

// Function to make HTTP request
async function testUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      console.log(`Status code for ${url}: ${res.statusCode}`);
      resolve({
        url,
        statusCode: res.statusCode
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
  console.log('Testing HTTP status codes for routes...');
  
  // Ensure server is running on port 3008 (from earlier output)
  const baseUrl = 'http://localhost:3008';
  
  // Test different routes
  const routes = [
    '/',
    '/about',
    '/sample',
    '/nonexistent'
  ];
  
  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    await testUrl(url);
  }
  
  console.log('Tests complete');
}

// Run tests
runTests();