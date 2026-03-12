# ADR-001: Runtime Choice — Bun over Node.js

## Status
Accepted

## Date
2026-03-12

## Context
We needed to choose a JavaScript runtime for our backend API server.
The main candidates were Node.js (industry standard) and Bun (modern, performance-focused).

## Decision
We chose **Bun** as our runtime.

## Reasons
- ~5x faster HTTP throughput than Node.js + Express in benchmarks
- Native TypeScript execution — no build step needed
- Built-in tools: package manager, test runner, bundler (fewer dependencies)
- Drop-in Node.js compatibility for the ecosystem
- Cold starts under 1ms

## Tradeoffs
- Smaller community and ecosystem compared to Node.js
- Less battle-tested in large-scale production
- Some Node.js native modules may have compatibility issues

## Consequences
- All developers must have Bun installed locally
- CI/CD pipelines use Bun instead of Node.js
- We accept the risk of early-adopter issues in exchange for performance gains