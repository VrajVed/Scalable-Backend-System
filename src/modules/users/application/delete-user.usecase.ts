import type { IUserRepository } from "../domain/user.repository.interface";
import { UserNotFoundError } from "../domain/user.errors";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new UserNotFoundError(String(id));
    }

    await this.userRepository.softDelete(id);
  }
}
