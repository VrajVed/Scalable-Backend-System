# ADR-008: Security Strategy — OWASP-aligned

## Status
Accepted

## Date
2026-03-19

## Context
We needed a security strategy that protects against the most common API vulnerabilities
without over-engineering for the current scale. The OWASP API Security Top 10 was used
as the reference framework.

## Decision
We implemented a layered security strategy covering authorization, rate limiting,
input validation, and HTTP security headers.

## Implementation

### BOLA Protection (API1)
Every resource endpoint compares the requested resource's owner against the
authenticated user's clerkId. Admins bypass this check via role hierarchy.

### Rate Limiting (API4)
Redis-backed sliding window rate limiter (100 requests/minute per IP).
Redis ensures limits work correctly across multiple API server instances.
In-memory rate limiting was rejected because it breaks under horizontal scaling.

### Input Validation (API3)
All request bodies are parsed through Zod DTOs before reaching use cases.
Unknown fields are stripped automatically preventing mass assignment attacks.
Body size is limited to 1MB at the HTTP framework level.

### Security Headers
All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 0` (modern browsers use CSP)
- `Strict-Transport-Security: max-age=31536000`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

## Tradeoffs
- Redis-backed rate limiting adds a network hop per request
- Strict Zod validation may reject valid edge case inputs
- Security headers add a small overhead to every response

## Consequences
- All new endpoints must implement BOLA checks
- Rate limiting is global — per-endpoint limits can be added later
- Security headers are applied via a single `onSend` hook
- Input size limits prevent large payload DoS attacks