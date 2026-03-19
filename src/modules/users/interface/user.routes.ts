import type { FastifyInstance, RouteHandlerMethod } from "fastify";
import { requireAuth } from "../../../shared/middleware/requireAuth";
import { requireRole } from "../../../shared/middleware/requireRole";
import { getMe, getUserById, createUser, updateUser, deleteUser } from "./user.controller";

export const userRoutes = async (app: FastifyInstance): Promise<void> => {
  app.addHook("preHandler", requireAuth);

  app.get("/me", getMe as RouteHandlerMethod);
  app.get("/:id", getUserById as RouteHandlerMethod);
  app.post("/", { preHandler: [requireRole("admin")] }, createUser as RouteHandlerMethod);
  app.patch("/:id", updateUser as RouteHandlerMethod);
  app.delete("/:id", { preHandler: [requireRole("admin")] }, deleteUser as RouteHandlerMethod);
};
