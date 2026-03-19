import type { IUserRepository } from "../domain/user.repository.interface";
import { UserNotFoundError } from "../domain/user.errors";
import type { UserEntity } from "../domain/user.entity";

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError(String(id));
    }

    return user;
  }
}
