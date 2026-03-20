import Fastify from "fastify";
import { randomUUID } from "crypto";
import { env } from "./config/env";
import { errorHandler } from "./shared/middleware/errorHandler";
import { clerkWebhookHandler } from "./modules/users/users.webhook";
import { userRoutes } from "./modules/users/interface/user.routes";
import { rateLimiter } from "./shared/middleware/rateLimiter";
import "./infrastructure/queue/workers/email.worker";
import { sendWelcomeEmail } from "./infrastructure/queue/producers/email.producer";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
    ...(env.NODE_ENV === "development" && {
      transport: {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "HH:MM:ss" },
      },
    }),
  },
  // Every request gets a unique ID automatically
  genReqId: () => randomUUID(),
  bodyLimit: 1048576,
});

app.setErrorHandler(errorHandler);
app.addHook("preHandler", rateLimiter);

// Attach request ID to every response header
app.addHook("onRequest", async (request, reply) => {
  reply.header("x-request-id", request.id);
});

app.addHook("onSend", async (_request, reply) => {
  reply.header("X-Content-Type-Options", "nosniff");
  reply.header("X-Frame-Options", "DENY");
  reply.header("X-XSS-Protection", "0");
  reply.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  reply.header("Referrer-Policy", "strict-origin-when-cross-origin");
  reply.header("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
});

app.get("/health", async (): Promise<{ status: string; timestamp: string }> => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

app.register(userRoutes, { prefix: "/users" });

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
app.get("/test-email", async (request, reply) => {
  await sendWelcomeEmail("test@example.com", "Test User");
  return reply.send({ queued: true });
});
app.post("/webhooks/clerk", clerkWebhookHandler);

start();
