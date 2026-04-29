import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories = await prisma.kategori.findMany();
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

// POST: Create a new category
export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description } = req.body; // Menerima payload bahasa Inggris

    const newCategory = await prisma.kategori.create({
      data: {
        nama_kategori: name, // Map ke kolom database
        deskripsi: description, // Map ke kolom database
      },
    });

    res.status(201).json({
      message: "Category successfully created!",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error });
  }
};

// PUT: Update an existing category
export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id as string, 10);
    const { name, description } = req.body;

    const updatedCategory = await prisma.kategori.update({
      where: { id: categoryId },
      data: {
        nama_kategori: name,
        deskripsi: description,
      },
    });

    res.status(200).json({
      message: "Category successfully updated!",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update category. It might not exist.",
      error,
    });
  }
};

// DELETE: Delete a category
export const deleteCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id as string, 10);

    await prisma.kategori.delete({
      where: { id: categoryId },
    });

    res.status(200).json({ message: "Category successfully deleted!" });
  } catch (error) {
    // Jika gagal, mungkin kategori sudah dipakai oleh sebuah produk
    res.status(500).json({
      message:
        "Failed to delete category. Ensure no products are using this category.",
      error,
    });
  }
};
