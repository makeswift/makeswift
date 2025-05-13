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

# Install dependencies if needed
echo -e "${YELLOW}Installing test dependencies...${NC}"
pnpm install

# Install browser binaries if needed
echo -e "${YELLOW}Installing browser binaries...${NC}"
npx playwright install chromium

# Start Next.js app in background
echo -e "${YELLOW}Starting Next.js app on port ${NEXTJS_PORT}...${NC}"
cd "$NEXTJS_DIR" && PORT=$NEXTJS_PORT pnpm dev & NEXTJS_PID=$!

# Start Remix app in background
echo -e "${YELLOW}Starting Remix app on port ${REMIX_PORT}...${NC}"
cd "../../$REMIX_DIR" && pnpm dev --port=$REMIX_PORT & REMIX_PID=$!

# Return to test directory
cd "../../tests/framework-comparison"

# Wait for both servers to be ready
echo -e "${YELLOW}Waiting for servers to be ready...${NC}"
sleep 10

# Run the tests
echo -e "${YELLOW}Running visual comparison tests...${NC}"
npx playwright test sample-page.spec.ts --headed

# Capture exit code
TEST_EXIT_CODE=$?

# Kill background processes
echo -e "${YELLOW}Shutting down servers...${NC}"
kill $NEXTJS_PID $REMIX_PID

# Wait for processes to terminate
sleep 3

# Show results
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}Tests completed successfully!${NC}"
  echo -e "${YELLOW}View the test report with:${NC} npx playwright show-report"
else
  echo -e "${RED}Tests failed with exit code: ${TEST_EXIT_CODE}${NC}"
  echo -e "${YELLOW}View the test report with:${NC} npx playwright show-report"
fi

exit $TEST_EXIT_CODE