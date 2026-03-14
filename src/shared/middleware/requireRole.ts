import type { FastifyReply, FastifyRequest } from "fastify";
import { ForbiddenError, UnauthorizedError } from "../errors";

const roleHierarchy: Record<string, number> = {
  admin: 3,
  moderator: 2,
  user: 1,
};
// this is created in such a way that admin > moderator > user. So if you require "moderator", both "admin" and "moderator" can access, but not "user".
export const requireRole = (minimumRole: "user" | "moderator" | "admin") => {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const auth = request.auth;

    if (!auth?.userId) {
      throw new UnauthorizedError();
    }

    const metadata = auth.sessionClaims?.metadata; // Assuming role is stored in session claims metadata
    const userRole = (metadata as Record<string, string> | undefined)?.["role"] ?? "user";
    const userLevel = roleHierarchy[userRole] ?? 0;
    const requiredLevel = roleHierarchy[minimumRole] ?? 0;

    if (userLevel < requiredLevel) {
      throw new ForbiddenError(`Requires ${minimumRole} role or higher`);
    }
  };
};
