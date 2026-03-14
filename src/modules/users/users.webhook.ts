import type { FastifyReply, FastifyRequest } from "fastify";
import { Webhook } from "svix";
import { env } from "../../config/env";
import { db } from "../../infrastructure/database/db";
import { users } from "../../infrastructure/database/schema/users";
import { eq } from "drizzle-orm";

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
  };
};

export const clerkWebhookHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let event: ClerkUserEvent;

  try {
    event = wh.verify(JSON.stringify(request.body), {
      "svix-id": request.headers["svix-id"] as string,
      "svix-timestamp": request.headers["svix-timestamp"] as string,
      "svix-signature": request.headers["svix-signature"] as string,
    }) as ClerkUserEvent;
  } catch {
    return reply.status(400).send({ message: "Invalid webhook signature" });
  }

  const { type, data } = event;

  if (type === "user.created") {
    await db.insert(users).values({
      clerkId: data.id,
      email: data.email_addresses[0]?.email_address ?? "",
      firstName: data.first_name,
      lastName: data.last_name,
    });
  }

  if (type === "user.updated") {
    await db
      .update(users)
      .set({
        email: data.email_addresses[0]?.email_address ?? "",
        firstName: data.first_name,
        lastName: data.last_name,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, data.id));
  }

  if (type === "user.deleted") {
    await db.update(users).set({ deletedAt: new Date() }).where(eq(users.clerkId, data.id));
  }

  return reply.status(200).send({ received: true });
};
