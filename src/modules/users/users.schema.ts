import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "../../infrastructure/database/schema/users";
import { z } from "zod";

// Base schemas derived from the table — single source of truth
export const insertUserSchema = createInsertSchema(users, {
  email: z.email(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
});

export const selectUserSchema = createSelectSchema(users);

// DTOs — what the API accepts (never expose internal fields)
export const createUserDTO = insertUserSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
  clerkId: true,
});

export const updateUserDTO = insertUserSchema
  .pick({
    firstName: true,
    lastName: true,
  })
  .partial();

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;
export type CreateUserDTO = z.infer<typeof createUserDTO>;
export type UpdateUserDTO = z.infer<typeof updateUserDTO>;
