#!/bin/sh
# End-to-end verification for the Heelllo Boxcode chat backend.
# Requires: server running on :4000, curl, python3.
set -u
BASE="http://localhost:4000"
EMAIL="test+$(date +%s)@example.com"

echo "== [1] SIGNUP =="
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"testpass123\"}"
echo

TOKEN=$(curl -s -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"testpass123\"}" \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])')
echo "== [2] LOGIN OK, token length: ${#TOKEN} =="
echo

i=1
while IFS= read -r msg; do
  echo "== [3.$i] CHAT: $msg =="
  curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/api/chat" \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d "$(python3 -c 'import json,sys;print(json.dumps({"message":sys.argv[1]}))' "$msg")"
  echo
  i=$((i+1))
done <<'EOF'
How do I deploy my Next.js frontend?
How much does the paid plan cost?
How do I invite teammates to my project?
Why am I getting 429 rate limited?
What is a JWT secret?
What is the weather in Tokyo right now?
EOF

echo "== [4] HISTORY (full) =="
curl -s -w "\nHTTP %{http_code}\n" "$BASE/api/chat/history" -H "Authorization: Bearer $TOKEN"
echo
echo "== [5] HISTORY SUMMARY =="
curl -s "$BASE/api/chat/history" -H "Authorization: Bearer $TOKEN" \
  | python3 -c 'import sys,json; d=json.load(sys.stdin); print(len(d),"messages; roles:",[m["role"] for m in d])'
