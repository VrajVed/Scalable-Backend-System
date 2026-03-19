# ADR-005: Architecture Pattern — DDD + Hexagonal Vertical Slices

## Status
Accepted

## Date
2026-03-19

## Context
We needed an architecture pattern that would scale mentally as the codebase grows,
allow independent testing of business logic, and make it easy to swap infrastructure
(e.g. Drizzle → Prisma, Fastify → Express) without touching core logic.

## Decision
We chose **Domain-Driven Design (DDD) + Hexagonal Architecture** organized as
**vertical slices** per module.

## Structure
Each module (e.g. users/) contains four layers:
- `domain/` — entities, errors, repository interfaces (zero external dependencies)
- `application/` — use cases that orchestrate domain objects
- `infrastructure/` — Drizzle repository implementations, external service adapters
- `interface/` — Fastify controllers, routes, DTOs

## Reasons
- Business logic in use cases is testable without a database or HTTP server
- Swapping Drizzle for another ORM only requires changing `infrastructure/`
- Vertical slices mean each module is self-contained and independently deployable
- New developers can find code by what it does, not how it works

## Tradeoffs
- More files and folders than a simple MVC structure
- Overkill for very small projects
- Requires discipline to keep layers from leaking into each other

## Consequences
- All database access goes through repository interfaces
- Controllers never import Drizzle directly
- Domain layer has zero external dependencies
- New features follow the same vertical slice pattern