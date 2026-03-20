import { Queue } from "bullmq";
import { bullMQConnection } from "../../config/redis";

export const Queues = {
  EMAIL: new Queue("email", {
    connection: bullMQConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    },
  }),

  NOTIFICATION: new Queue("notification", {
    connection: bullMQConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    },
  }),
} as const;
