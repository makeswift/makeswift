import fetch from 'node-fetch';

// Configuration
const REMIX_URL = 'http://localhost:4173'; // Production server port

async function checkHealth() {
  try {
    // Check homepage
    console.log('Checking homepage...');
    const homeResponse = await fetch(`${REMIX_URL}/`);
    console.log('Homepage Status:', homeResponse.status);
    
    if (homeResponse.status !== 200) {
      console.error('Homepage returned non-200 status code');
      const text = await homeResponse.text();
      console.log('Homepage Text Response:', text.substring(0, 500) + '...');
    } else {
      console.log('Homepage loaded successfully');
    }
    
    // Check health endpoint
    console.log('\nChecking health endpoint...');
    const healthResponse = await fetch(`${REMIX_URL}/api/health`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Health Status:', healthResponse.status);
    
    const contentType = healthResponse.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const data = await healthResponse.json();
      console.log('JSON Response:', data);
    } else {
      const text = await healthResponse.text();
      console.log('Text Response:', text.substring(0, 500) + '...');
    }
    
    // Check a sample page to see if dynamic routing works
    console.log('\nChecking a sample page...');
    const sampleResponse = await fetch(`${REMIX_URL}/sample`);
    console.log('Sample Page Status:', sampleResponse.status);
    
    if (sampleResponse.status !== 200) {
      console.error('Sample page returned non-200 status code');
    } else {
      console.log('Sample page loaded successfully');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkHealth();