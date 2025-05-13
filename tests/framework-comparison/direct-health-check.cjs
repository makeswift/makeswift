const health = require('./utils/health.js');

async function main() {
  const nextjsUrl = process.argv[2];
  const remixUrl = process.argv[3]; 
  
  try {
    const result = await health.checkFrameworksHealth(nextjsUrl, remixUrl, { 
      maxRetries: 3, 
      verbose: true,
      timeout: 5000
    });
    
    if (result.allHealthy) {
      console.log('{"status":"ready","message":"All servers are healthy"}');
      process.exit(0);
    } else {
      if (!result.nextjs.isHealthy) {
        console.log(JSON.stringify({
          status: 'error',
          message: `Next.js server not healthy: ${result.nextjs.error}`
        }));
      }
      if (!result.remix.isHealthy) {
        console.log(JSON.stringify({
          status: 'error',
          message: `Remix server not healthy: ${result.remix.error}`
        }));
      }
      process.exit(1);
    }
  } catch (error) {
    console.log(JSON.stringify({
      status: 'error',
      message: error.message
    }));
    process.exit(1);
  }
}

main();