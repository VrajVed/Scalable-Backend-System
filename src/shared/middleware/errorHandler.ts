import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../errors";

export const errorHandler = (
  error: FastifyError | AppError | Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  // Known application error
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      code: error.code,
      message: error.message,
    });
  }

  // Fastify validation error
  if ("statusCode" in error && error.statusCode === 400) {
    return reply.status(400).send({
      success: false,
      code: "VALIDATION_ERROR",
      message: error.message,
    });
  }

  // Unknown error - don't leak internals
  return reply.status(500).send({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
};
