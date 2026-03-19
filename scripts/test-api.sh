#!/bin/bash

BASE_URL="http://localhost:3000"

# ── Token ────────────────────────────────────────────────────────
# Replace this with your token from http://localhost:5173
TOKEN="your_token_here"

# ── Token ────────────────────────────────────────────────────────
if [ -z "$TOKEN" ]; then
  echo "❌ TOKEN is not set. Run: export TOKEN=your_token_here"
  exit 1
fi

# ── Helper ───────────────────────────────────────────────────────
print_test() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🧪 $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ── Tests ────────────────────────────────────────────────────────
print_test "Health Check"
curl -s $BASE_URL/health | jq

print_test "GET /users/me"
curl -s $BASE_URL/users/me \
  -H "Authorization: Bearer $TOKEN" | jq

print_test "GET /users/1"
curl -s $BASE_URL/users/1 \
  -H "Authorization: Bearer $TOKEN" | jq

print_test "PATCH /users/1"
curl -s -X PATCH $BASE_URL/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Updated"}' | jq

print_test "POST /users (admin only)"
curl -s -X POST $BASE_URL/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "clerkId": "clerk_test_123", "firstName": "Test", "lastName": "User"}' | jq

print_test "DELETE /users/1 (admin only)"
curl -s -X DELETE $BASE_URL/users/1 \
  -H "Authorization: Bearer $TOKEN" | jq

echo ""
echo "✅ Done!"