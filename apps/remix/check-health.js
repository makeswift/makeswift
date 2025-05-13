import fetch from 'node-fetch';

// Configuration
const REMIX_URL = 'http://localhost:3003'; // Update with correct port

async function checkHealth() {
  try {
    const response = await fetch(`${REMIX_URL}/api/health`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('JSON Response:', data);
    } else {
      const text = await response.text();
      console.log('Text Response:', text.substring(0, 500) + '...');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkHealth();