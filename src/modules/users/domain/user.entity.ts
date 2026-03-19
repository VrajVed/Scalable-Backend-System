export interface UserEntity {
  id: number;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "admin" | "moderator" | "user";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
