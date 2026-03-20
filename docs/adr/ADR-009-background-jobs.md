# ADR-009: Background Jobs — BullMQ + Redis

## Status
Accepted

## Date
2026-03-19

## Context
We needed a background job system for async tasks like sending emails, notifications,
and data sync operations. These tasks should not block API responses and must be
reliable, retryable, and observable.

## Decision
We chose **BullMQ** with **Redis** as the job queue system.

## Architecture
```
API Server (Producer) → Redis → Worker Process (Consumer)
```

Workers run as a **separate Docker service** from the API server so they can
be scaled independently.

## Reasons
- BullMQ is Redis-backed — jobs persist across restarts, no data loss
- Built-in retry with exponential backoff (3 attempts by default)
- Job progress tracking via `job.updateProgress()`
- Flow Producers for multi-step job orchestration (DAG)
- Bull Board UI for visual queue monitoring
- Workers scale independently from API servers

## Queue Design
- `email` queue — transactional emails (welcome, password reset)
- `notification` queue — push notifications and in-app alerts
- Each queue has: 3 retry attempts, exponential backoff, DLQ monitoring

## Dead Letter Queue
Failed jobs that exhaust all retries are monitored via `QueueEvents`.
Stalled and failed jobs log alerts — production will route these to Slack/PagerDuty.

## Tradeoffs
- Redis is a single point of failure for the job system
- BullMQ ships its own ioredis version causing type conflicts with strict TypeScript
- Workers must be deployed separately adding operational complexity

## Consequences
- API server never sends emails directly — always via queue
- Worker process has its own Docker service and graceful shutdown handler
- BullMQ connection uses raw host/port options to avoid ioredis version conflicts
- Bull Board dashboard is available at `/admin/queues` (admin only in production)