import type { IUserRepository } from "../domain/user.repository.interface";
import { UserAlreadyExistsError } from "../domain/user.errors";
import type { CreateUserDTO } from "../users.schema";
import type { UserEntity } from "../domain/user.entity";

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<UserEntity> {
    const existing = await this.userRepository.findByEmail(data.email);

    if (existing) {
      throw new UserAlreadyExistsError(data.email);
    }

    return this.userRepository.create(data);
  }
}
