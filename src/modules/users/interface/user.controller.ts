import type { FastifyRequest, FastifyReply, RouteHandler } from "fastify";
import { UserRepository } from "../infrastructure/user.repository";
import { CreateUserUseCase } from "../application/create-user.usecase";
import { GetUserUseCase } from "../application/get-user.usecase";
import { UpdateUserUseCase } from "../application/update-user.usecase";
import { DeleteUserUseCase } from "../application/delete-user.usecase";
import { createUserDTO, updateUserDTO } from "../users.schema";
import { ForbiddenError } from "../../../shared/errors";
import type { UserEntity } from "../domain/user.entity";

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

export const getMe = async (
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<UserEntity | null> => {
  const clerkId = request.auth.userId!;
  const user = await userRepository.findByClerkId(clerkId);
  return user;
};

export const getUserById: RouteHandler<{ Params: { id: string } }> = async (request, _reply) => {
  const id = Number(request.params.id);
  const user = await getUserUseCase.execute(id);

  if (
    user.clerkId !== request.auth.userId &&
    request.auth.sessionClaims?.metadata?.role !== "admin"
  ) {
    throw new ForbiddenError();
  }

  return user;
};

export const createUser: RouteHandler = async (request, reply) => {
  const dto = createUserDTO.parse(request.body);
  const user = await createUserUseCase.execute(dto);
  return reply.status(201).send(user);
};

export const updateUser: RouteHandler<{ Params: { id: string } }> = async (request, _reply) => {
  const id = Number(request.params.id);
  const dto = updateUserDTO.parse(request.body);

  const existing = await userRepository.findById(id);
  if (
    existing?.clerkId !== request.auth.userId &&
    request.auth.sessionClaims?.metadata?.role !== "admin"
  ) {
    throw new ForbiddenError();
  }

  return updateUserUseCase.execute(id, dto);
};

export const deleteUser: RouteHandler<{ Params: { id: string } }> = async (request, reply) => {
  const id = Number(request.params.id);

  const existing = await userRepository.findById(id);
  if (
    existing?.clerkId !== request.auth.userId &&
    request.auth.sessionClaims?.metadata?.role !== "admin"
  ) {
    throw new ForbiddenError();
  }

  await deleteUserUseCase.execute(id);
  return reply.status(204).send();
};
