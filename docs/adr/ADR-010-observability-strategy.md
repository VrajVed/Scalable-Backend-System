# ADR-010: Observability Strategy — Prometheus + Grafana

## Status
Accepted

## Date
2026-03-19

## Context
We needed an observability strategy to monitor application health, performance,
and business metrics. The two main options considered were:
- ELK Stack (Elasticsearch, Logstash, Kibana) — log-centric
- Prometheus + Grafana — metrics-centric

## Decision
We chose **Prometheus + Grafana** as the primary observability layer for metrics,
deferring ELK Stack to a later phase when log volume justifies the overhead.

## Reasons

### Prometheus + Grafana
- Lightweight — runs well on a single Docker Compose setup
- `prom-client` integrates directly into the Fastify app
- Pull-based scraping — Prometheus controls collection interval
- PromQL is powerful for alerting on trends (error rate, latency, queue depth)
- Grafana has pre-built dashboards for Node.js, Redis, and PostgreSQL exporters
- Immediate value — HTTP metrics, queue metrics, and business metrics in one place

### Why ELK was deferred
- Elasticsearch requires significant memory (1GB+ JVM heap minimum)
- ELK is better suited for log search and correlation, not metrics alerting
- Log volume at current scale doesn't justify the operational overhead
- Pino structured JSON logs are already in place for future ELK integration

## Metrics Instrumented
- `http_requests_total` — counter by method, route, status code
- `http_request_duration_ms` — histogram with P50/P95/P99 buckets
- `queue_jobs_total` — counter by queue name and status
- `users_created_total` — business metric counter
- Default Node.js metrics — memory, CPU, event loop lag

## Tradeoffs
- Prometheus is pull-based — short-lived jobs may be missed
- Grafana dashboards require manual setup initially
- No centralized log search without ELK

## Consequences
- `/metrics` endpoint exposed for Prometheus scraping (internal only)
- Prometheus and Grafana added to Docker Compose
- Alerting rules cover: high error rate, slow P95 latency, queue backlog
- ELK Stack remains on the roadmap for Phase 5 when log search is needed