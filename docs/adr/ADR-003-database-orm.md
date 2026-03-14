# ADR-003: Database & ORM — PostgreSQL + Drizzle

## Status
Accepted

## Date
2026-03-14

## Context
We needed a relational database and an ORM/query builder. The main candidates were:
- Prisma (most popular ORM in Node.js ecosystem)
- Drizzle ORM (lightweight, SQL-first)
- Raw SQL with postgres.js

## Decision
We chose **PostgreSQL** as our database and **Drizzle ORM** as our query layer,
hosted on **Neon** (serverless PostgreSQL).

## Reasons
- Drizzle is ~30kb vs Prisma's ~500kb+ bundle size
- Drizzle uses direct SQL — no proxy overhead unlike Prisma
- Schema is defined in TypeScript — single source of truth via drizzle-zod
- Full SQL control while retaining type safety
- Neon provides serverless PostgreSQL with a generous free tier
- PostgreSQL 17 on Neon with SSL support

## Tradeoffs
- Drizzle has a smaller ecosystem than Prisma
- Less autocompletion magic compared to Prisma Client
- Neon cold starts on free tier can add latency

## Consequences
- All schema changes go through `db:generate` + `db:migrate` (never `push` in production)
- Zod validation schemas are derived from Drizzle tables via drizzle-zod
- Connection pool configured with `max: 20`, SSL enabled for Neon