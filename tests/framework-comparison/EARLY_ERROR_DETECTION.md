# Early Error Detection for Framework Comparison Tests

This document explains the early error detection mechanism implemented for the Makeswift framework comparison tests.

## Background

Previously, the test scripts would start the Next.js and Remix servers and wait a fixed amount of time (15 seconds) before proceeding with tests, regardless of whether the servers were actually ready or if they had encountered build errors. This could lead to long wait times even when servers had already failed to start properly.

## Implemented Solution

We've implemented a comprehensive early error detection system with the following components:

### 1. Health Check Endpoints

Health check endpoints can be added to both frameworks:

- **Next.js**: `/api/health` endpoint returns a 200 status with JSON `{ status: "ok", framework: "nextjs", timestamp: "..." }`
- **Remix**: `/api/health` endpoint returns a 200 status with JSON `{ status: "ok", framework: "remix", timestamp: "..." }`

These endpoints allow the test infrastructure to verify that the servers are running correctly before proceeding with tests.

### 2. Health Check Utility

A JavaScript utility (`utils/health.js`) provides functions for:

- Checking if servers are healthy
- Detecting build errors in server logs
- Monitoring server startup with configurable retry logic

The utility exports the following functions:

- `checkServerHealth`: Checks a single server's health with retry logic
- `checkFrameworksHealth`: Checks both Next.js and Remix servers
- `detectBuildErrors`: Monitors server logs for build/runtime errors

### 3. Fallback Health Checking

The health check is designed with multiple fallback mechanisms to handle cases where health endpoints aren't yet implemented:

1. **API Health Endpoint Check**: First tries the dedicated `/api/health` endpoint
2. **Root Response Check**: If health endpoint isn't available, checks if the server responds at its root URL
3. **Status Code Analysis**: Considers 4xx errors as "server is running" (just not at that path)

This multi-layered approach ensures that we can detect when servers are actually running, even if they don't have dedicated health endpoints.

### 4. Updated Test Scripts

Both test scripts (`run-tests.sh` and `direct-test.sh`) have been updated to:

1. Use the health check utility to verify servers are ready
2. Detect build errors early via log monitoring
3. Fail fast if servers can't start properly
4. Provide detailed error information
5. Allow bypassing health checks with the `--bypass-health` flag

Additionally, the Playwright configuration has been updated to use the health endpoints as URL targets for the `webServer` configuration.

## Benefits

This implementation provides several benefits:

1. **Faster Feedback**: Tests fail quickly when servers have build errors
2. **Higher Reliability**: Tests only proceed when both servers are verified to be running correctly
3. **Better Debugging**: More detailed error information when servers fail to start
4. **More Efficient Testing**: No more waiting for fixed timeouts when servers have already failed
5. **Resilient Health Checking**: Multiple fallback methods for different server configurations

## Usage

The updated test scripts (`run-tests.sh` and `direct-test.sh`) can be used as before. They now include early error detection without changing the user interface.

### Run Tests

```bash
# Run tests with snapshot comparison
./run-tests.sh

# Update snapshots for future comparisons
./run-tests.sh --update-snapshots

# Bypass health checks (if you know servers are already running)
./run-tests.sh --bypass-health

# Bypass health checks AND update snapshots
./run-tests.sh --bypass-health --update-snapshots

# Quick test without starting servers (assumes servers are running)
./direct-test.sh

# Quick test without health checks
BYPASS_HEALTH=true ./direct-test.sh
```

## Extending the System

To extend this system:

1. Add more sophisticated error pattern detection in `detectBuildErrors`
2. Enhance health endpoints with more detailed status information
3. Add more comprehensive server log analysis

For example, to add more detailed health checks, update the health endpoints to include memory usage, startup time, or other metrics relevant to debugging performance issues.

## Implementation Notes

1. **CommonJS vs. ESM**: The health check utility is implemented in CommonJS format to avoid module format issues between different Node.js environments.

2. **Resilient Error Handling**: The health check continues even when JSON parsing fails, allowing it to work with non-JSON responses.

3. **Environment Variable Control**: Health checks can be bypassed using the `BYPASS_HEALTH` environment variable.

4. **Basic Connectivity Check**: A simple connectivity check is used as the final fallback to determine if servers are online.