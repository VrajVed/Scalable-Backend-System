import { eq } from "drizzle-orm";
import { db } from "../../../infrastructure/database/db";
import { users } from "../../../infrastructure/database/schema/users";
import type { IUserRepository } from "../domain/user.repository.interface";
import type { UserEntity } from "../domain/user.entity";
import type { CreateUserDTO, UpdateUserDTO } from "../users.schema";

export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<UserEntity | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

    return result[0] ?? null;
  }

  async findByClerkId(clerkId: string): Promise<UserEntity | null> {
    const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

    return result[0] ?? null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

    return result[0] ?? null;
  }

  async create(data: CreateUserDTO): Promise<UserEntity> {
    const result = await db.insert(users).values(data).returning();
    return result[0]!;
  }

  async update(id: number, data: UpdateUserDTO): Promise<UserEntity> {
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return result[0]!;
  }

  async softDelete(id: number): Promise<void> {
    await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id));
  }
}
