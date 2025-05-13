#!/bin/bash

# Run the framework comparison tests
# This script starts both Next.js and Remix servers and runs comparison tests

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Framework Comparison Tests${NC}"
echo "========================================"

# Setup directories
NEXTJS_DIR="../../apps/nextjs-app-router"
REMIX_DIR="../../apps/remix"
NEXTJS_PORT=3000
REMIX_PORT=3001
NEXTJS_URL="http://localhost:$NEXTJS_PORT"
REMIX_URL="http://localhost:$REMIX_PORT"
MAX_STARTUP_TIME=60 # Maximum time to wait for servers to be ready (in seconds)

# Install dependencies if needed
echo -e "${YELLOW}Installing test dependencies...${NC}"
pnpm install

# Install browser binaries if needed
echo -e "${YELLOW}Installing browser binaries...${NC}"
npx playwright install chromium

# Make sure both apps have the Makeswift API key
echo -e "${YELLOW}Checking for Makeswift API key...${NC}"
if [ ! -f "$NEXTJS_DIR/.env.local" ]; then
  echo -e "${RED}Error: $NEXTJS_DIR/.env.local not found${NC}"
  echo "Please create this file with your MAKESWIFT_SITE_API_KEY"
  exit 1
fi

# Copy API key to Remix app if needed
if [ ! -f "$REMIX_DIR/.env.local" ]; then
  echo -e "${YELLOW}Copying Makeswift API key to Remix app...${NC}"
  cp "$NEXTJS_DIR/.env.local" "$REMIX_DIR/.env.local"
fi

# Start Next.js app in background, piping logs through the error detector
echo -e "${YELLOW}Starting Next.js app on port ${NEXTJS_PORT}...${NC}"
(cd "$NEXTJS_DIR" && PORT=$NEXTJS_PORT pnpm dev | node ../../tests/framework-comparison/check-logs.cjs) & NEXTJS_PID=$!

# Start Remix app in background, piping logs through the error detector
echo -e "${YELLOW}Starting Remix app on port ${REMIX_PORT}...${NC}"
(cd "$REMIX_DIR" && PORT=$REMIX_PORT pnpm dev | node ../../tests/framework-comparison/check-logs.cjs) & REMIX_PID=$!

# Wait for both servers to be ready with our health check utility
echo -e "${YELLOW}Waiting for servers to be ready (max ${MAX_STARTUP_TIME}s)...${NC}"

START_TIME=$(date +%s)
HEALTH_STATUS=""

while true; do
  node ./check-health.cjs "$NEXTJS_URL" "$REMIX_URL" "$MAX_STARTUP_TIME" > health_result.json
  HEALTH_STATUS=$(cat health_result.json | grep -o '"status":"[^"]*"' | cut -d '"' -f 4)
  
  if [ "$HEALTH_STATUS" == "ready" ]; then
    echo -e "${GREEN}Both servers are ready!${NC}"
    break
  elif [ "$HEALTH_STATUS" == "timeout" ] || [ "$HEALTH_STATUS" == "error" ]; then
    echo -e "${RED}Failed to start servers:${NC} $(cat health_result.json)"
    echo -e "${RED}Check server logs for more details.${NC}"
    kill $NEXTJS_PID $REMIX_PID
    exit 1
  fi
  
  CURRENT_TIME=$(date +%s)
  ELAPSED=$((CURRENT_TIME - START_TIME))
  
  if [ $ELAPSED -gt $MAX_STARTUP_TIME ]; then
    echo -e "${RED}Timed out waiting for servers to start!${NC}"
    kill $NEXTJS_PID $REMIX_PID
    exit 1
  fi
  
  # Display a spinner to show progress
  echo -ne "${YELLOW}Waiting for servers to be ready: $ELAPSED seconds elapsed...\r${NC}"
  sleep 1
done

# Run the tests
echo -e "${YELLOW}Running Makeswift page comparison tests...${NC}"

# If we need to bypass health check
if [ "$1" == "--bypass-health" ]; then
  export BYPASS_HEALTH=true
fi

# If this is the first run, we need to update snapshots
if [ "$1" == "--update-snapshots" ] || [ "$2" == "--update-snapshots" ]; then
  echo -e "${YELLOW}Updating snapshots...${NC}"
  npx playwright test makeswift-page.spec.ts --update-snapshots --headed
else
  # Regular test run
  npx playwright test makeswift-page.spec.ts --headed
fi

# Capture exit code
TEST_EXIT_CODE=$?

# Kill background processes
echo -e "${YELLOW}Shutting down servers...${NC}"
kill $NEXTJS_PID $REMIX_PID

# Wait for processes to terminate
sleep 3

# Clean up temporary files
rm -f ./check-health.cjs ./check-logs.cjs health_result.json

# Show results
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}Tests completed successfully!${NC}"
  echo -e "${YELLOW}View the test report with:${NC} npx playwright show-report"
else
  echo -e "${RED}Tests failed with exit code: ${TEST_EXIT_CODE}${NC}"
  echo -e "${YELLOW}View the test report with:${NC} npx playwright show-report"
fi

# Always provide location of the screenshots
echo -e "${YELLOW}Screenshots saved in:${NC} test-results/screenshots/"
echo -e "${YELLOW}Usage:${NC}"
echo -e "  - Run with snapshots: ./run-tests.sh"
echo -e "  - Update snapshots:   ./run-tests.sh --update-snapshots"

exit $TEST_EXIT_CODE