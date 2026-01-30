import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("It has to be an email"),
  password: z
    .string()
    .min(6)
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  username: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("It has to be an email"),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
