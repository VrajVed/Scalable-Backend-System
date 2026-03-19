import type { UserEntity } from "./user.entity";
import type { CreateUserDTO, UpdateUserDTO } from "../users.schema";

export interface IUserRepository {
  findById(id: number): Promise<UserEntity | null>;
  findByClerkId(clerkId: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserDTO): Promise<UserEntity>;
  update(id: number, data: UpdateUserDTO): Promise<UserEntity>;
  softDelete(id: number): Promise<void>;
}
