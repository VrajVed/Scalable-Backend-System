import type { SignedInAuthObject } from "@clerk/backend";

declare module "fastify" {
  interface FastifyRequest {
    auth: SignedInAuthObject;
  }
}
