const health = require('./utils/health.js');

async function main() {
  const nextjsUrl = process.argv[2];
  const remixUrl = process.argv[3]; 
  const maxTime = parseInt(process.argv[4] || '60', 10);
  const startTime = Date.now();
  
  while (true) {
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed > maxTime) {
      console.log('{"status":"timeout","message":"Servers failed to start within the allotted time"}');
      process.exit(1);
    }
    
    try {
      const result = await health.checkFrameworksHealth(nextjsUrl, remixUrl, { 
        maxRetries: 1, 
        verbose: false 
      });
      
      if (result.allHealthy) {
        console.log('{"status":"ready","message":"All servers are healthy"}');
        process.exit(0);
      } else {
        // Wait a bit before trying again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      // Wait a bit before trying again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

main().catch(error => {
  console.log(JSON.stringify({
    status: 'error',
    message: error.message
  }));
  process.exit(1);
});