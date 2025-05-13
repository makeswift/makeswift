#!/bin/bash

# Simple script to check routes on both servers
NEXTJS_URL=http://localhost:3000
REMIX_URL=http://localhost:3001

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Routes to test
ROUTES=("/" "/about" "/sample" "/some-random-route")

echo -e "${YELLOW}Testing routes on both Next.js and Remix servers${NC}"
echo "=================================================="

for route in "${ROUTES[@]}"; do
  echo -e "${YELLOW}Testing route: ${route}${NC}"
  
  # Test Next.js
  next_status=$(curl -s -o /dev/null -w "%{http_code}" "${NEXTJS_URL}${route}")
  if [ "$next_status" -eq 200 ]; then
    echo -e "${GREEN}Next.js (${next_status}): Success${NC}"
  else
    echo -e "${RED}Next.js (${next_status}): Failure${NC}"
  fi
  
  # Test Remix
  remix_status=$(curl -s -o /dev/null -w "%{http_code}" "${REMIX_URL}${route}")
  if [ "$remix_status" -eq 200 ]; then
    echo -e "${GREEN}Remix  (${remix_status}): Success${NC}"
  else
    echo -e "${RED}Remix  (${remix_status}): Failure${NC}"
  fi
  
  echo "===================================================="
done

echo -e "${YELLOW}All routes tested.${NC}"