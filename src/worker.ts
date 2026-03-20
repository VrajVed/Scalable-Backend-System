import { emailWorker } from "./infrastructure/queue/workers/email.worker";
import { startDLQMonitors } from "./infrastructure/queue/dlq.monitor";

console.log("🚀 Worker process started");

startDLQMonitors();

const shutdown = async () => {
  console.log("Worker shutting down...");
  await emailWorker.close();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown());
process.on("SIGINT", () => shutdown());
