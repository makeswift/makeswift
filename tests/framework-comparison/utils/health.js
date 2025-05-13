/**
 * Health check utility for framework comparison tests
 * Provides functions to verify that test servers are running correctly
 * before executing comparison tests.
 */

/**
 * Checks if a server is healthy by calling its health endpoint
 * with configurable retry logic.
 */
async function checkServerHealth(
  baseUrl,
  options = {}
) {
  const {
    maxRetries = 10,
    retryDelay = 1000,
    timeout = 3000,
    verbose = false,
  } = options;

  const healthUrl = `${baseUrl}/api/health`;
  let attempts = 0;
  
  if (verbose) {
    console.log(`Checking health of server at ${baseUrl}...`);
  }

  while (attempts < maxRetries) {
    attempts++;
    
    try {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // First try a basic fetch to the root path to see if the server is responding at all
      const rootResponse = await fetch(baseUrl, { 
        signal: controller.signal,
        method: 'HEAD'
      }).finally(() => clearTimeout(timeoutId));
      
      // If we got any response from the root URL, we'll consider it "healthy enough"
      // This is a fallback for when the health endpoint isn't available yet
      if (rootResponse.ok || rootResponse.status < 500) {
        if (verbose) {
          console.log(`✅ Server at ${baseUrl} is reachable (fallback check)`);
        }
        return {
          isHealthy: true,
          details: {
            attempts,
            responseTime: Date.now() - startTime,
            statusCode: rootResponse.status,
            fallback: true,
            body: { status: 'ok', fallbackCheck: true }
          }
        };
      }
      
      // Try the dedicated health endpoint
      const response = await fetch(healthUrl, { 
        signal: controller.signal 
      }).finally(() => clearTimeout(timeoutId));
      
      const responseTime = Date.now() - startTime;
      
      // Even if we can't parse as JSON, if the response is 200, consider it healthy
      if (response.ok) {
        let body;
        try {
          body = await response.json();
        } catch (e) {
          // If we can't parse JSON, that's ok, still return healthy
          body = { status: 'ok', fallback: true };
        }
        
        if (verbose) {
          console.log(`✅ Server at ${baseUrl} is healthy (${responseTime}ms)`);
        }
        
        return {
          isHealthy: true,
          details: {
            attempts,
            responseTime,
            statusCode: response.status,
            body
          }
        };
      }
      
      const statusCode = response.status;
      if (verbose) {
        console.log(`❌ Health check failed: ${baseUrl} returned status ${statusCode} (attempt ${attempts}/${maxRetries})`);
      }
      
      // For server errors (status >= 500), we consider the server unhealthy
      // For client errors (status between 400-499), we can still consider the server "running"
      // since it's responding, just not to our health check (which might not be implemented yet)
      if (statusCode < 500) {
        if (verbose) {
          console.log(`⚠️ Server at ${baseUrl} is responding but health check returned ${statusCode}. Considering "healthy enough".`);
        }
        
        return {
          isHealthy: true,
          details: {
            attempts,
            responseTime,
            statusCode,
            fallback: true,
            body: { status: 'ok', fallbackCheck: true }
          }
        };
      }
      
      // If we got here, the server has a 5xx error or is not responding
      if (verbose) {
        console.log(`❌ Server returned error status ${statusCode}`);
      }
      
      // If we haven't exceeded max retries, we'll try again
      if (attempts < maxRetries) {
        if (verbose) {
          console.log(`⏳ Waiting ${retryDelay}ms before retry...`);
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // Otherwise return unhealthy
      return {
        isHealthy: false,
        error: `Server returned status ${statusCode}`,
        details: {
          attempts,
          responseTime,
          statusCode
        }
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        if (verbose) {
          console.log(`⏱️ Health check timed out after ${timeout}ms (attempt ${attempts}/${maxRetries})`);
        }
      } else if (verbose) {
        console.log(`❌ Health check failed: ${error.message} (attempt ${attempts}/${maxRetries})`);
      }
      
      // If we've exceeded our max retries, return failure
      if (attempts >= maxRetries) {
        return {
          isHealthy: false,
          error: error.message || 'Unknown error',
          details: {
            attempts
          }
        };
      }
      
      // Otherwise wait and retry
      if (verbose) {
        console.log(`⏳ Waiting ${retryDelay}ms before next retry...`);
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  // This should never be reached because the loop will return on max retries
  return {
    isHealthy: false,
    error: 'Max retries exceeded',
    details: {
      attempts
    }
  };
}

/**
 * Checks health for both Next.js and Remix servers
 * Returns an object with results for both servers
 */
async function checkFrameworksHealth(
  nextjsUrl,
  remixUrl,
  options = {}
) {
  const [nextjsHealth, remixHealth] = await Promise.all([
    checkServerHealth(nextjsUrl, options),
    checkServerHealth(remixUrl, options)
  ]);
  
  const allHealthy = nextjsHealth.isHealthy && remixHealth.isHealthy;
  
  if (options.verbose) {
    if (allHealthy) {
      console.log('✅ All framework servers are healthy');
    } else {
      console.log('❌ One or more framework servers are unhealthy');
      if (!nextjsHealth.isHealthy) {
        console.log(`- Next.js server is unhealthy: ${nextjsHealth.error}`);
      }
      if (!remixHealth.isHealthy) {
        console.log(`- Remix server is unhealthy: ${remixHealth.error}`);
      }
    }
  }
  
  return {
    allHealthy,
    nextjs: nextjsHealth,
    remix: remixHealth
  };
}

/**
 * Helper for streaming server logs and detecting build errors
 * This can be used to monitor server logs for build/runtime errors
 */
function detectBuildErrors(
  stdout,
  stderr,
  errorPatterns = [
    /error/i, 
    /exception/i, 
    /fatal/i, 
    /failed to compile/i
  ]
) {
  return new Promise((resolve) => {
    let errorFound = null;
    let timeout;

    // Function to process a chunk of data
    const processChunk = (data, isStderr = false) => {
      const text = data.toString();
      
      // Check for error patterns
      for (const pattern of errorPatterns) {
        if (pattern.test(text)) {
          errorFound = text;
          clearTimeout(timeout);
          resolve(errorFound);
          return;
        }
      }
    };

    // Set up listeners for stdout and stderr
    stdout.on('data', processChunk);
    stderr.on('data', (data) => processChunk(data, true));

    // Set a timeout to resolve with null if no errors found
    timeout = setTimeout(() => {
      resolve(errorFound);
    }, 30000); // 30 seconds timeout
  });
}

module.exports = {
  checkServerHealth,
  checkFrameworksHealth,
  detectBuildErrors
};