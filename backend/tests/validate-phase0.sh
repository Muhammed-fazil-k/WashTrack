#!/bin/bash

BASE_URL="http://localhost:5000"
MOBILE="+919999999999"

echo "=== Phase 0 Validation Script ==="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
curl -s $BASE_URL/health | jq
echo -e "\n"

# Test 2: Request OTP
echo "Test 2: Request OTP for Super Admin"
RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/request-otp \
  -H "Content-Type: application/json" \
  -d "{\"mobile_number\": \"$MOBILE\"}")
echo $RESPONSE | jq
echo -e "\n"

# Test 3: Invalid mobile number
echo "Test 3: Invalid Mobile Number (should fail)"
curl -s -X POST $BASE_URL/api/v1/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "+910000000000"}' | jq
echo -e "\n"

# Test 4: Missing mobile number
echo "Test 4: Missing Mobile Number (should fail)"
curl -s -X POST $BASE_URL/api/v1/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{}' | jq
echo -e "\n"

echo "=== Manual Steps ==="
echo "1. Check server console for OTP: [DEV MODE] OTP for $MOBILE: ######"
echo "2. Then test OTP verification:"
echo ""
echo "curl -X POST $BASE_URL/api/v1/auth/verify-otp \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"mobile_number\": \"$MOBILE\", \"otp\": \"YOUR_OTP_HERE\"}' | jq"
echo ""
echo "3. Test invalid OTP:"
echo "curl -X POST $BASE_URL/api/v1/auth/verify-otp \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"mobile_number\": \"$MOBILE\", \"otp\": \"000000\"}' | jq"
