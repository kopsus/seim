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
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const search = req.query.search as string;
    const size = req.query.size as string;
    const categoryId = req.query.categoryId
      ? parseInt(req.query.categoryId as string, 10)
      : undefined;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;
    const whereClause: any = {};

    if (search) {
      whereClause.nama_produk = { contains: search };
    }
    if (size) {
      whereClause.size = size;
    }
    if (categoryId) {
      whereClause.kategori_id = categoryId;
    }
    if (status) {
      whereClause.status = status;
    }

    const [products, totalItems] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        include: { kategori: true },
        orderBy: { created_at: "desc" },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    res.status(200).json({
      data: products,
      meta: {
        totalItems: totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
      },
    });
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

    const existingProduct = await prisma.product.findFirst({
      where: { nama_produk: name },
    });

    if (existingProduct) {
      if (files && files.length > 0) {
        files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }

      res.status(400).json({
        message: `Produk dengan nama "${name}" sudah terdaftar di sistem. Harap gunakan nama lain jika ini produk yang berbeda.`,
      });
      return;
    }

    if (!files || files.length === 0) {
      res.status(400).json({ message: "At least one photo is required" });
      return;
    }

    const photoPaths = files.map(
      (file) => `${process.env.UPLOAD_PATH_PRODUCTS}/${file.filename}`,
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

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const categoryId = req.body.categoryId
      ? parseInt(req.body.categoryId as string, 10)
      : undefined;
    const price = req.body.price
      ? parseFloat(req.body.price as string)
      : undefined;
    const { name, description, condition, size, status, badge } = req.body;

    let finalPhotoPaths = existingProduct.foto as string[];
    const originalPhotos = existingProduct.foto as string[];
    const files = req.files as Express.Multer.File[];

    if (req.body.retainedPhotos !== undefined || (files && files.length > 0)) {
      let retained: string[] = [];
      if (req.body.retainedPhotos) {
        try {
          retained = JSON.parse(req.body.retainedPhotos as string);
        } catch (e) {
          retained = Array.isArray(req.body.retainedPhotos)
            ? req.body.retainedPhotos
            : [req.body.retainedPhotos];
        }
      }

      const newPhotoPaths =
        files && files.length > 0
          ? files.map(
              (file) => `${process.env.UPLOAD_PATH_PRODUCTS}/${file.filename}`,
            )
          : [];

      finalPhotoPaths = [...retained, ...newPhotoPaths];

      const photosToDelete = originalPhotos.filter(
        (oldUrl) => !retained.includes(oldUrl),
      );

      photosToDelete.forEach((photoUrl) => {
        const fullPath = path.join(process.cwd(), "public", photoUrl);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        kategori_id: categoryId || existingProduct.kategori_id,
        nama_produk: name || existingProduct.nama_produk,
        deskripsi: description || existingProduct.deskripsi,
        kondisi: condition || existingProduct.kondisi,
        size: size || existingProduct.size,
        harga: price || existingProduct.harga,
        status: status || existingProduct.status,
        badge: badge || existingProduct.badge,
        foto: finalPhotoPaths,
      },
    });

    res.status(200).json({
      message: "Product successfully updated!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
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
        let cleanPath = photoUrl;

        if (cleanPath.startsWith("public/")) {
          cleanPath = cleanPath.replace("public/", "");
        }

        if (cleanPath.startsWith("/")) {
          cleanPath = cleanPath.substring(1);
        }

        const fullPath = path.join(process.cwd(), "public", cleanPath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        } else {
          console.warn(`File tidak ditemukan, diabaikan: ${fullPath}`);
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
