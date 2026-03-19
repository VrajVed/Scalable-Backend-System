import type { IUserRepository } from "../domain/user.repository.interface";
import { UserNotFoundError } from "../domain/user.errors";
import type { UpdateUserDTO } from "../users.schema";
import type { UserEntity } from "../domain/user.entity";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number, data: UpdateUserDTO): Promise<UserEntity> {
    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new UserNotFoundError(String(id));
    }

    return this.userRepository.update(id, data);
  }
}
