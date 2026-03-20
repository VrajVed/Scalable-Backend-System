import { Queues } from "../queue.registry";
import type { EmailJobData } from "../workers/email.worker";

export const sendEmailJob = async (data: EmailJobData): Promise<void> => {
  await Queues.EMAIL.add("send-email", data, {
    priority: 1,
  });
};

export const sendWelcomeEmail = async (to: string, firstName: string): Promise<void> => {
  await sendEmailJob({
    to,
    subject: "Welcome!",
    template: "welcome",
    data: { firstName },
  });
};
