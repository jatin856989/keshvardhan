#!/usr/bin/env bash
# HTTP-level pre-launch checks: status codes, redirects, headers, APIs and the
# full checkout -> order page -> eBook flow. Usage: bash scripts/audit-http.sh [base]
set -u
B="${1:-http://localhost:3000}"
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }
hdr() { curl -s -D - -o /dev/null "$@"; }

echo "== status codes"
for p in / /products /products/daily-root-powder /products/nope /this-does-not-exist /robots.txt /sitemap.xml /manifest.webmanifest /opengraph-image.png /products/routine-bundle/opengraph-image /api/health /admin /admin/login /icon.svg /apple-icon.png /images/products/routine-bundle.webp; do
  printf "%s %s\n" "$(code "$B$p")" "$p"
done

echo "== redirects (expect 308 permanent)"
for p in /home /index.html /shop /shop/root-ritual-oil /product/daily-root-powder /collections/all /ebook /faqs /privacy-policy /returns /contact-us /about-us; do
  printf "%s -> %s  %s\n" "$(code "$B$p")" "$(curl -s -o /dev/null -w '%{redirect_url}' "$B$p")" "$p"
done
printf "admin guard: %s -> %s\n" "$(code "$B/admin/orders")" "$(curl -s -o /dev/null -w '%{redirect_url}' "$B/admin/orders")"

echo "== security headers on /"
hdr "$B/" | grep -iE "^(x-content-type-options|x-frame-options|referrer-policy|permissions-policy|strict-transport-security|x-powered-by|content-type|x-robots-tag)"
echo "== headers on /api/health"
hdr "$B/api/health" | grep -iE "^(x-robots-tag|cache-control)"
curl -s "$B/api/health"; echo

echo "== robots.txt"
curl -s "$B/robots.txt"
echo "== sitemap.xml (url count + first 3)"
curl -s "$B/sitemap.xml" | grep -o "<loc>[^<]*</loc>" | wc -l
curl -s "$B/sitemap.xml" | grep -o "<loc>[^<]*</loc>" | head -3

echo "== contact API"
printf "invalid: %s\n" "$(code -X POST -H 'Content-Type: application/json' -d '{"name":"A","email":"bad","subject":"x","message":"short"}' "$B/api/contact")"
printf "honeypot: %s\n" "$(code -X POST -H 'Content-Type: application/json' -d '{"name":"Bot","email":"bot@example.com","subject":"buy now","message":"spam spam spam spam","website":"http://x"}' "$B/api/contact")"
printf "valid: "; curl -s -X POST -H 'Content-Type: application/json' -d '{"name":"Audit Tester","email":"audit@example.com","subject":"Pre-launch audit test","message":"This is a test message from the audit script.","startedAt":1}' "$B/api/contact"; echo
printf "valid (slow enough): "; curl -s -X POST -H 'Content-Type: application/json' -d "{\"name\":\"Audit Tester\",\"email\":\"audit@example.com\",\"subject\":\"Pre-launch audit test 2\",\"message\":\"This is a second test message from the audit script.\",\"startedAt\":$(( $(date +%s%3N) - 10000 ))}" "$B/api/contact"; echo

echo "== waitlist API"
curl -s -X POST -H 'Content-Type: application/json' -d '{"email":"audit-waitlist@example.com","source":"audit"}' "$B/api/waitlist"; echo

echo "== checkout: COD order"
COD=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"items":[{"slug":"routine-bundle","quantity":1}],"paymentMethod":"cod","customer":{"name":"Audit Tester","email":"audit-order@example.com","phone":"9876543210","addressLine1":"12 MG Road","city":"Bengaluru","state":"Karnataka","pincode":"560001","marketingConsent":true}}' "$B/api/checkout")
echo "$COD"
OID=$(echo "$COD" | sed -n 's/.*"orderId":"\([^"]*\)".*/\1/p'); KEY=$(echo "$COD" | sed -n 's/.*"accessKey":"\([^"]*\)".*/\1/p')
printf "order page with key: %s\n" "$(code "$B/order/$OID?k=$KEY")"
curl -s "$B/order/$OID?k=$KEY" > /tmp/order.html
grep -o "Thank you, Audit[^<]*" /tmp/order.html | head -1
grep -o "Order KS[0-9A-Z-]*" /tmp/order.html | head -1
printf "order page without key shows: %s\n" "$(grep -o "We could not find that order" "$B/order/$OID" 2>/dev/null; curl -s "$B/order/$OID" | grep -o "We could not find that order" | head -1)"
EBOOK=$(grep -o '/api/ebook?t=[^"]*' /tmp/order.html | head -1 | sed 's/&amp;/\&/g')
printf "ebook url present: %s\n" "${EBOOK:+yes}"
curl -s -D - -o /tmp/guide.pdf "$B$EBOOK" | grep -iE "^(HTTP|content-type|content-disposition|content-length)"
head -c 8 /tmp/guide.pdf; echo
printf "ebook with bad token: %s\n" "$(code "$B/api/ebook?t=bad.1.2")"
printf "resend guide: "; curl -s -X POST -H 'Content-Type: application/json' -d "{\"k\":\"$KEY\"}" "$B/api/orders/$OID/resend-guide"; echo

echo "== checkout: online order (mock mode when no Razorpay keys)"
ON=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"items":[{"slug":"daily-root-powder","quantity":2}],"paymentMethod":"razorpay","customer":{"name":"Audit Tester","email":"audit-order2@example.com","phone":"9876543211","addressLine1":"5 Park Street","city":"Kolkata","state":"West Bengal","pincode":"700016"}}' "$B/api/checkout")
echo "$ON"
OID2=$(echo "$ON" | sed -n 's/.*"orderId":"\([^"]*\)".*/\1/p')
printf "mock-pay: "; curl -s -X POST -H 'Content-Type: application/json' -d "{\"orderId\":\"$OID2\"}" "$B/api/checkout/mock-pay"; echo
printf "mock-pay again (idempotent): "; curl -s -X POST -H 'Content-Type: application/json' -d "{\"orderId\":\"$OID2\"}" "$B/api/checkout/mock-pay"; echo
printf "verify with bad signature: %s\n" "$(code -X POST -H 'Content-Type: application/json' -d "{\"orderId\":\"$OID2\",\"razorpay_order_id\":\"order_x\",\"razorpay_payment_id\":\"pay_x\",\"razorpay_signature\":\"deadbeef\"}" "$B/api/razorpay/verify")"
printf "webhook without signature: %s\n" "$(code -X POST -H 'Content-Type: application/json' -d '{"event":"payment.captured"}' "$B/api/webhooks/razorpay")"
printf "checkout validation error: "; curl -s -X POST -H 'Content-Type: application/json' -d '{"items":[],"paymentMethod":"cod","customer":{}}' "$B/api/checkout" | head -c 300; echo
