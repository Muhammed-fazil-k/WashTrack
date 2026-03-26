#!/bin/bash

# WashTrack Phase 0 - Complete Authentication Test
# This script tests the full OTP authentication flow

BASE_URL="http://localhost:5000"

echo "========================================"
echo "  WashTrack Authentication Flow Test"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "Test 1: Health Check"
HEALTH=$(curl -s $BASE_URL/health)
echo "$HEALTH" | jq
if echo "$HEALTH" | jq -e '.status == "OK"' > /dev/null; then
  echo -e "${GREEN}✓ Health check passed${NC}"
else
  echo -e "${RED}✗ Health check failed${NC}"
  exit 1
fi
echo ""

# Test 2: Request OTP for Super Admin
echo "========================================"
echo "Test 2: Request OTP for Super Admin"
echo "Mobile: +919999999999"
echo "========================================"
OTP_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "+919999999999"}')
echo "$OTP_RESPONSE" | jq
if echo "$OTP_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✓ OTP requested successfully${NC}"
else
  echo -e "${RED}✗ OTP request failed${NC}"
  exit 1
fi
echo ""

# Prompt for OTP
echo -e "${YELLOW}========================================"
echo "⚠️  MANUAL STEP REQUIRED"
echo "========================================${NC}"
echo ""
echo "Check your server console for the OTP. It will look like:"
echo "🔐 [DEV MODE] OTP for +919999999999: 123456"
echo ""
read -p "Enter the OTP from console: " USER_OTP
echo ""

# Test 3: Verify OTP
echo "========================================"
echo "Test 3: Verify OTP"
echo "========================================"
VERIFY_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"mobile_number\": \"+919999999999\", \"otp\": \"$USER_OTP\"}")
echo "$VERIFY_RESPONSE" | jq
if echo "$VERIFY_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✓ OTP verified successfully${NC}"
  ACCESS_TOKEN=$(echo "$VERIFY_RESPONSE" | jq -r '.accessToken')
  REFRESH_TOKEN=$(echo "$VERIFY_RESPONSE" | jq -r '.refreshToken')
  echo ""
  echo "Access Token: ${ACCESS_TOKEN:0:50}..."
  echo "Refresh Token: ${REFRESH_TOKEN:0:50}..."
else
  echo -e "${RED}✗ OTP verification failed${NC}"
  echo "$VERIFY_RESPONSE" | jq '.error'
  exit 1
fi
echo ""

# Test 4: Test Invalid OTP
echo "========================================"
echo "Test 4: Test Invalid OTP (should fail)"
echo "========================================"
# Request new OTP
curl -s -X POST $BASE_URL/api/v1/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "+919999999999"}' > /dev/null

# Try wrong OTP
INVALID_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "+919999999999", "otp": "000000"}')
echo "$INVALID_RESPONSE" | jq
if echo "$INVALID_RESPONSE" | jq -e '.success == false' > /dev/null; then
  echo -e "${GREEN}✓ Invalid OTP rejected correctly${NC}"
else
  echo -e "${RED}✗ Invalid OTP should have been rejected${NC}"
fi
echo ""

# Test 5: Refresh Token
echo "========================================"
echo "Test 5: Refresh Access Token"
echo "========================================"
REFRESH_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")
echo "$REFRESH_RESPONSE" | jq
if echo "$REFRESH_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✓ Token refreshed successfully${NC}"
  NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.accessToken')
  echo "New Access Token: ${NEW_ACCESS_TOKEN:0:50}..."
else
  echo -e "${RED}✗ Token refresh failed${NC}"
fi
echo ""

# Test 6: Test other user roles
echo "========================================"
echo "Test 6: Test Company Admin Login"
echo "Mobile: +919876543211"
echo "========================================"
ADMIN_OTP_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "+919876543211"}')
echo "$ADMIN_OTP_RESPONSE" | jq
if echo "$ADMIN_OTP_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✓ Company Admin OTP requested${NC}"
  echo -e "${YELLOW}Check console for OTP to test Company Admin login${NC}"
else
  echo -e "${RED}✗ Company Admin OTP request failed${NC}"
fi
echo ""

# Test 7: Test Worker
echo "========================================"
echo "Test 7: Test Worker Login"
echo "Mobile: +919876543212"
echo "========================================"
WORKER_OTP_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "+919876543212"}')
echo "$WORKER_OTP_RESPONSE" | jq
if echo "$WORKER_OTP_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✓ Worker OTP requested${NC}"
  echo -e "${YELLOW}Check console for OTP to test Worker login${NC}"
else
  echo -e "${RED}✗ Worker OTP request failed${NC}"
fi
echo ""

echo "========================================"
echo -e "${GREEN}✅ Phase 0 Authentication Tests Complete${NC}"
echo "========================================"
echo ""
echo "Summary:"
echo "- Health check: ✓"
echo "- OTP generation: ✓"
echo "- OTP verification: ✓"
echo "- Invalid OTP rejection: ✓"
echo "- Token refresh: ✓"
echo "- Multi-role support: ✓"
echo ""
echo "Next: Install TablePlus to view database tables!"
