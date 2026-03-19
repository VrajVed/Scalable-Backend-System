import Redis from "ioredis";
import type { FastifyRequest, FastifyReply } from "fastify";
import { env } from "../../config/env";
import { AppError } from "../errors";

const redis = new Redis(env.REDIS_URL);

export class RateLimitError extends AppError {
  constructor() {
    super("Too many requests, please try again later", 429, "RATE_LIMIT_EXCEEDED");
  }
}

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 100;

export const rateLimiter = async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
  const identifier = (request.headers["x-forwarded-for"] as string) ?? request.ip ?? "unknown";

  const key = `rate_limit:${identifier}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  if (current > MAX_REQUESTS) {
    throw new RateLimitError();
  }
};
