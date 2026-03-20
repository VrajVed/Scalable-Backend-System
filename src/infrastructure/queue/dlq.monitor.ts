import { QueueEvents } from "bullmq";
import { bullMQConnection } from "../../config/redis";

const createDLQMonitor = (queueName: string) => {
  const queueEvents = new QueueEvents(queueName, {
    connection: bullMQConnection,
  });

  queueEvents.on("failed", ({ jobId, failedReason }) => {
    console.error(`💀 [DLQ] Job ${jobId} in queue "${queueName}" exhausted all retries`);
    console.error(`💀 [DLQ] Reason: ${failedReason}`);

    // TODO: in production replace with real alerting:
    // - Slack webhook
    // - PagerDuty
    // - Email alert
  });

  queueEvents.on("stalled", ({ jobId }) => {
    console.warn(`⚠️ [DLQ] Job ${jobId} in queue "${queueName}" is stalled`);
  });

  return queueEvents;
};

export const startDLQMonitors = () => {
  createDLQMonitor("email");
  createDLQMonitor("notification");
  console.log("🔍 DLQ monitors started");
};
