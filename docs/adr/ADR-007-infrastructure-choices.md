# ADR-007: Infrastructure Choices — Neon PostgreSQL + Docker Redis

## Status
Accepted

## Date
2026-03-19

## Context
We needed a PostgreSQL database and Redis instance for local development and
early production. The options were fully local Docker for both, or managed
cloud services.

## Decision
- **PostgreSQL**: Neon (serverless managed PostgreSQL)
- **Redis**: Docker (local container)

## Reasons

### Neon for PostgreSQL
- Serverless — no local Docker container needed for the database
- Automatic scaling and branching (branch per PR in future CI/CD)
- Built-in connection pooling via Neon's proxy
- Free tier sufficient for development
- Production-ready without ops overhead

### Docker for Redis
- No managed Redis needed at this stage
- Redis is lightweight and runs well locally
- BullMQ and rate limiting only need Redis locally for now
- Can be swapped for Upstash Redis in production with zero code changes

## Tradeoffs
- Neon requires internet connection for local development
- Neon free tier has compute limits (auto-suspends after inactivity)
- Docker Redis state is lost if volume is removed

## Consequences
- `DATABASE_URL` points to Neon connection string
- `REDIS_URL` points to local Docker Redis
- Migrations run via `drizzle-kit migrate` against Neon
- `drizzle-kit push` is only used in development, never production
- In production, Redis will be replaced with Upstash or a managed Redis service