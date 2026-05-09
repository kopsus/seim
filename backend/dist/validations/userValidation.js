"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    username: zod_1.z
        .string({ message: "Username is required" })
        .min(3, "Username minimal 3 karakter"),
    password: zod_1.z
        .string({ message: "Password is required" })
        .min(6, "Password minimal 6 karakter"),
    role: zod_1.z.enum(["ADMIN", "KASIR"], { message: "Role harus ADMIN atau KASIR" }),
});
exports.updateUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username minimal 3 karakter").optional(),
    role: zod_1.z.enum(["ADMIN", "KASIR"]).optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string({ message: "Password lama wajib diisi" }),
    newPassword: zod_1.z
        .string({ message: "Password baru wajib diisi" })
        .min(6, "Password baru minimal 6 karakter"),
});
