import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3, "Username minimal 3 karakter"),
  password: z
    .string({ message: "Password is required" })
    .min(6, "Password minimal 6 karakter"),
  role: z.enum(["ADMIN", "KASIR"], { message: "Role harus ADMIN atau KASIR" }),
});

export const updateUserSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter").optional(),
  role: z.enum(["ADMIN", "KASIR"]).optional(),
});
