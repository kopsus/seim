"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.changePassword = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// GET: Ambil semua data user
const getUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: { created_at: "desc" },
        });
        res.status(200).json({ data: users });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal mengambil data user", error });
    }
};
exports.getUsers = getUsers;
// POST: Buat user baru (Admin/Kasir)
const createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const existingUser = await prisma_1.default.user.findUnique({ where: { username } });
        if (existingUser) {
            res
                .status(400)
                .json({ message: "Username sudah terdaftar. Gunakan username lain." });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = await prisma_1.default.user.create({
            data: {
                username,
                password_hash: hashedPassword,
                role,
            },
            select: { id: true, username: true, role: true },
        });
        res.status(201).json({ message: "User berhasil dibuat", data: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal membuat user", error });
    }
};
exports.createUser = createUser;
// PUT: Edit data user (Tanpa edit password)
const updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const { username, role } = req.body;
        if (username) {
            const usernameTaken = await prisma_1.default.user.findFirst({
                where: { username: username, id: { not: userId } },
            });
            if (usernameTaken) {
                res
                    .status(400)
                    .json({ message: "Username tersebut sudah digunakan user lain." });
                return;
            }
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: { username, role },
            select: { id: true, username: true, role: true },
        });
        res
            .status(200)
            .json({ message: "Data user berhasil diperbarui", data: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal memperbarui user", error });
    }
};
exports.updateUser = updateUser;
// DELETE: Hapus user
const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const currentAdminId = req.user.id;
        if (userId === currentAdminId) {
            res
                .status(400)
                .json({ message: "Anda tidak dapat menghapus akun Anda sendiri!" });
            return;
        }
        await prisma_1.default.user.delete({
            where: { id: userId },
        });
        res.status(200).json({ message: "User berhasil dihapus" });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal menghapus user", error });
    }
};
exports.deleteUser = deleteUser;
// PUT: Ganti password akun sendiri (Bisa diakses Admin dan Kasir)
const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { oldPassword, newPassword } = req.body;
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({ message: "User tidak ditemukan" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            res
                .status(400)
                .json({ message: "Password lama yang Anda masukkan salah." });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, salt);
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { password_hash: hashedNewPassword },
        });
        res.status(200).json({
            message: "Password berhasil diubah. Silakan gunakan password baru untuk login selanjutnya.",
        });
    }
    catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Gagal mengubah password", error });
    }
};
exports.changePassword = changePassword;
// GET: Ambil profil user yang sedang login (Bisa diakses Admin dan Kasir)
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                role: true,
                created_at: true,
            },
        });
        if (!user) {
            res.status(404).json({ message: "User tidak ditemukan." });
            return;
        }
        res.status(200).json({ data: user });
    }
    catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: "Gagal mengambil profil user", error });
    }
};
exports.getProfile = getProfile;
