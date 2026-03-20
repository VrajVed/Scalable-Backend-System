import { Worker, type Job } from "bullmq";
import { bullMQConnection } from "../../../config/redis";

export type EmailJobData = {
  to: string;
  subject: string;
  template: "welcome" | "password-reset" | "notification";
  data: Record<string, unknown>;
};

const processEmailJob = async (job: Job<EmailJobData>): Promise<void> => {
  const { to, subject, template, data } = job.data;

  await job.updateProgress(10);

  // Simulate sending email (replace with real email provider later e.g. Resend, SendGrid)
  console.log(`📧 Sending email:`, { to, subject, template, data });

  await job.updateProgress(50);

  // TODO: integrate real email provider here
  await new Promise((resolve) => setTimeout(resolve, 500));

  await job.updateProgress(100);
};

export const emailWorker = new Worker<EmailJobData>("email", processEmailJob, {
  connection: bullMQConnection,
  concurrency: 5,
  limiter: {
    max: 100,
    duration: 60_000,
  },
});

emailWorker.on("completed", (job) => {
  console.log(`✅ Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Email job ${job?.id} failed:`, err.message);
});
