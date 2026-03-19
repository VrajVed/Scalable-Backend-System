# ADR-006: Validation Strategy — Zod + drizzle-zod

## Status
Accepted

## Date
2026-03-19

## Context
We needed a validation strategy that avoids duplicating type definitions across
the database schema, API DTOs, and TypeScript types. Duplication leads to drift
between layers and runtime bugs.

## Decision
We use **Zod** as the single validation library with **drizzle-zod** to
auto-generate Zod schemas directly from Drizzle table definitions.

## Pattern
```
Drizzle table definition
        ↓
drizzle-zod (createInsertSchema, createSelectSchema)
        ↓
Zod schemas → TypeScript types (z.infer)
        ↓
DTOs for HTTP layer (pick/omit/partial)
```

## Reasons
- Single source of truth — change the DB schema, validation updates automatically
- No manual type duplication between database and API layers
- Zod provides runtime validation + TypeScript types from one definition
- `safeParse` used for env vars — crashes app on startup if misconfigured
- DTOs use `.pick()` and `.omit()` to control what the API exposes

## Tradeoffs
- drizzle-zod adds a dependency coupling Drizzle and Zod together
- Complex business rule validations still need manual Zod schemas

## Consequences
- All request bodies are validated with Zod DTOs before reaching use cases
- Unknown fields are stripped automatically (mass assignment protection)
- Environment variables are validated at startup via Zod — fail fast pattern
- TypeScript types are always inferred from Zod schemas, never written manually