# ADR-002: Framework Choice — Fastify over Elysia/Hono

## Status
Accepted

## Date
2026-03-14

## Context
We needed an HTTP framework for our Bun-based REST API. The main candidates were:
- Elysia (Bun-native, highest raw throughput)
- Hono (lightweight, portable across runtimes)
- Fastify (Node.js battle-tested, rich ecosystem)

## Decision
We chose **Fastify** as our HTTP framework.

## Reasons
- Most production-proven of the three with years of battle-testing
- Built-in structured JSON logging via Pino (critical for ELK stack integration)
- Plugin ecosystem covers rate limiting, auth, observability out of the box
- `setErrorHandler` provides clean centralized error handling
- Request lifecycle hooks (`onRequest`, `preHandler`) map well to middleware patterns
- TypeScript support is first-class with declaration merging

## Tradeoffs
- Not Bun-native — slightly lower raw throughput than Elysia
- Heavier than Hono for simple use cases
- Plugin API has a learning curve

## Consequences
- All HTTP concerns go through Fastify's plugin/hook system
- We use Pino (bundled with Fastify) instead of Winston for logging
- Future rate limiting, swagger, and multipart plugins will use Fastify ecosystem