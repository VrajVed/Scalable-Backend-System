import type { FastifyReply, FastifyRequest } from "fastify";
import { createClerkClient } from "@clerk/backend";
import { env } from "../../config/env";
import { UnauthorizedError } from "../errors";

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

export const requireAuth = async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
  try {
    // Convert Fastify request to standard Web API Request
    const url = `http://${request.hostname}${request.url}`;
    const webRequest = new Request(url, {
      method: request.method,
      headers: request.headers as Record<string, string>,
    });
    const requestState = await clerk.authenticateRequest(webRequest, {
      publishableKey: env.CLERK_PUBLISHABLE_KEY,
    });

    if (!requestState.isSignedIn) {
      throw new UnauthorizedError();
    }

    request.auth = requestState.toAuth();
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError();
  }
};
