import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";

// GET: Ambil semua data user
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
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
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data user", error });
  }
};

// POST: Buat user baru (Admin/Kasir)
export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "Username sudah terdaftar. Gunakan username lain." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        password_hash: hashedPassword,
        role,
      },
      select: { id: true, username: true, role: true },
    });

    res.status(201).json({ message: "User berhasil dibuat", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat user", error });
  }
};

// PUT: Edit data user (Tanpa edit password)
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    const { username, role } = req.body;

    if (username) {
      const usernameTaken = await prisma.user.findFirst({
        where: { username: username, id: { not: userId } },
      });
      if (usernameTaken) {
        res
          .status(400)
          .json({ message: "Username tersebut sudah digunakan user lain." });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, role },
      select: { id: true, username: true, role: true },
    });

    res
      .status(200)
      .json({ message: "Data user berhasil diperbarui", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui user", error });
  }
};

// DELETE: Hapus user
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id as string, 10);

    const currentAdminId = (req as any).user.id;

    if (userId === currentAdminId) {
      res
        .status(400)
        .json({ message: "Anda tidak dapat menghapus akun Anda sendiri!" });
      return;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus user", error });
  }
};
