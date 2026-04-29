import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import prisma from "../config/prisma";

// GET: Fetch all products (Public - for Catalog)
export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        kategori: true,
      },
    });
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// GET: Fetch a single product by ID (Public - for Product Detail)
export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.id as string, 10);
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { kategori: true },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

// POST: Create a new product (Protected - Admin only)
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryId = parseInt(req.body.categoryId as string, 10);
    const price = parseFloat(req.body.price as string);
    const { name, description, condition, size, status, badge } = req.body;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ message: "At least one photo is required" });
      return;
    }

    const photoPaths = files.map(
      (file) => `/uploads/products/${file.filename}`,
    );

    const newProduct = await prisma.product.create({
      data: {
        kategori_id: categoryId,
        nama_produk: name,
        deskripsi: description,
        harga: price,
        kondisi: condition,
        size: size,
        status: status || "READY",
        badge: badge,
        foto: photoPaths,
      },
    });

    res
      .status(201)
      .json({ message: "Product successfully created!", data: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product", error });
  }
};

// PUT: Update an existing product (Protected - Admin only)
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.id as string, 10);
    const {
      categoryId,
      name,
      description,
      condition,
      size,
      price,
      status,
      badge,
      photos,
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        kategori_id: categoryId,
        nama_produk: name,
        deskripsi: description,
        kondisi: condition,
        size: size,
        harga: price,
        status: status,
        badge: badge,
        foto: photos,
      },
    });

    res
      .status(200)
      .json({ message: "Product successfully updated!", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};

// DELETE: Delete a product (Protected - Admin only)
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.id as string, 10);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    const photos = product.foto as string[];

    if (photos && Array.isArray(photos)) {
      photos.forEach((photoUrl) => {
        const fullPath = path.join(process.cwd(), "public", photoUrl);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    res
      .status(200)
      .json({ message: "Product and associated images successfully deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product", error });
  }
};
