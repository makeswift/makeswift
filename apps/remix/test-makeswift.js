/**
 * Simple test script to verify Makeswift integration
 */
import https from 'https';

// Makeswift API key from our env.ts file
const MAKESWIFT_SITE_API_KEY = '14f4ac75-39ac-4f23-a6b7-199dfd8ee6ae';

// Function to fetch page from Makeswift
async function fetchMakeswiftPage(path) {
  return new Promise((resolve, reject) => {
    const url = `https://api.makeswift.com/api/v1/sites/${MAKESWIFT_SITE_API_KEY}/pages?path=${path}&version=published`;
    
    console.log(`Fetching from: ${url}`);
    
    https.get(url, { 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      } 
    }, (res) => {
      const { statusCode } = res;
      
      if (statusCode !== 200) {
        console.error(`Request failed with status code: ${statusCode}`);
        res.resume(); // Consume response to free up memory
        resolve({ error: `Request failed with status code: ${statusCode}` });
        return;
      }
      
      res.setEncoding('utf8');
      let rawData = '';
      
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch (e) {
          console.error(`Error parsing response: ${e.message}`);
          resolve({ error: `Error parsing response: ${e.message}` });
        }
      });
    }).on('error', (e) => {
      console.error(`Request error: ${e.message}`);
      resolve({ error: e.message });
    });
  });
}

// Main function to test Makeswift integration
async function testMakeswift() {
  console.log('Testing Makeswift integration...');
  
  // Test paths
  const paths = ['/', '/about', '/nonexistent'];
  
  for (const path of paths) {
    console.log(`\nTesting path: ${path}`);
    const result = await fetchMakeswiftPage(path);
    
    if (result.error) {
      console.log(`- Error: ${result.error}`);
    } else if (!result.document) {
      console.log(`- Page not found or invalid response`);
    } else {
      console.log(`- Success! Page title: ${result.document.meta.title || 'No title'}`);
      console.log(`- Has content: ${result.document.root.children.length > 0 ? 'Yes' : 'No'}`);
    }
  }
  
  console.log('\nTest complete!');
}

// Run the test
testMakeswift();