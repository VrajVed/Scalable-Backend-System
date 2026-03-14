# ADR-004: Authentication Strategy — Clerk

## Status
Accepted

## Date
2026-03-14

## Context
We needed an authentication solution that handles user management, session handling,
and JWT verification. The main options were:
- Clerk (managed auth service)
- Auth.js (open source, self-hosted)
- Custom JWT implementation with jsonwebtoken

## Decision
We chose **Clerk** as our authentication provider.

## Reasons
- Managed service — no need to handle password hashing, session storage, or token rotation
- Hybrid auth model: sessions stored in Clerk DB + short-lived JWTs (60s expiry)
- JWT verified locally via JWKS — networkless verification on every request
- Built-in webhook system (`user.created`, `user.updated`, `user.deleted`) for syncing to PostgreSQL
- RBAC via `publicMetadata.role` with a custom role hierarchy map
- Svix signature verification ensures webhook authenticity

## Tradeoffs
- External service dependency — Clerk outage could affect auth
- Vendor lock-in to Clerk's API and dashboard
- 60 second window before revoked sessions are rejected

## Consequences
- User data lives in two places: Clerk (source of truth) and PostgreSQL (local cache)
- Webhooks keep PostgreSQL in sync with Clerk
- `requireAuth` middleware converts Fastify requests to Web API Request for Clerk SDK
- RBAC roles stored in Clerk `publicMetadata` and checked via `requireRole` middleware