/**
 * Verify Deployment Script
 * 
 * This script checks if the deployment is working correctly by making HTTP requests
 * to various endpoints and verifying the response.
 */
import http from 'http';

// Function to make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    console.log(`Making request to ${url}`);
    
    http.get(url, (res) => {
      const { statusCode } = res;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Request to ${url} completed with status ${statusCode}`);
        resolve({
          statusCode,
          data,
          headers: res.headers,
          url
        });
      });
    }).on('error', (err) => {
      console.error(`Error making request to ${url}: ${err.message}`);
      reject(err);
    });
  });
}

// Function to verify response
function verifyResponse(response) {
  const { statusCode, data, url } = response;
  
  // Basic verification
  if (statusCode !== 200) {
    console.error(`❌ ${url} returned status ${statusCode}`);
    return false;
  }
  
  // Check if the response contains key elements
  const hasFrameworkBadge = data.includes('framework-badge');
  const hasReactRoot = data.includes('id="root"');
  const hasRequireError = data.includes('require is not defined');
  
  console.log(`✅ ${url} returned status ${statusCode}`);
  console.log(`  - Has framework badge: ${hasFrameworkBadge ? 'Yes' : 'No'}`);
  console.log(`  - Has React root: ${hasReactRoot ? 'Yes' : 'No'}`);
  console.log(`  - Has require error: ${hasRequireError ? 'Yes ❌' : 'No ✅'}`);
  
  return !hasRequireError;
}

// Main function
async function verifyDeployment() {
  console.log('Verifying deployment...');
  
  const baseUrl = 'http://localhost:4175'; // Updated port from start.log
  const endpoints = [
    '/',
    '/about',
    '/sample',
    '/test.html',
    '/test-runtime.html'
  ];
  
  let allSuccess = true;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${baseUrl}${endpoint}`);
      const success = verifyResponse(response);
      if (!success) {
        allSuccess = false;
      }
      console.log('----------------------------');
    } catch (error) {
      console.error(`❌ Error verifying ${endpoint}: ${error.message}`);
      allSuccess = false;
      console.log('----------------------------');
    }
  }
  
  console.log(`Verification complete. ${allSuccess ? '✅ All tests passed' : '❌ Some tests failed'}`);
  return allSuccess;
}

// Run the verification
verifyDeployment()
  .then((success) => {
    console.log(`Exiting with ${success ? 'success' : 'failure'}`);
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });