import Fastify from "fastify";
import { randomUUID } from "crypto";
import { env } from "./config/env";
import { errorHandler } from "./shared/middleware/errorHandler";
import { clerkWebhookHandler } from "./modules/users/users.webhook";

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
});

app.setErrorHandler(errorHandler);

// Attach request ID to every response header
app.addHook("onRequest", async (request, reply) => {
  reply.header("x-request-id", request.id);
});

app.get("/health", async (): Promise<{ status: string; timestamp: string }> => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

app.post("/webhooks/clerk", clerkWebhookHandler);

start();
