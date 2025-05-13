const https = require('https');
const http = require('http');

// Configuration
const REMIX_URL = 'http://localhost:3003'; // Update with correct port

function checkHealth() {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };

  const req = http.request(`${REMIX_URL}/api/health`, options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    const contentType = res.headers['content-type'];
    console.log('Content-Type:', contentType);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (contentType && contentType.includes('application/json')) {
        try {
          const jsonData = JSON.parse(data);
          console.log('JSON Response:', jsonData);
        } catch (e) {
          console.log('Error parsing JSON:', e);
          console.log('Raw response:', data.substring(0, 500) + '...');
        }
      } else {
        console.log('Text Response:', data.substring(0, 500) + '...');
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('Error:', error);
  });
  
  req.end();
}

checkHealth();