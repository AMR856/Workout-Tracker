import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("It has to be an email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  username: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("It has to be an email"),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
