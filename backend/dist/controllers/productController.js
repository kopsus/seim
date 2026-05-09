"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("../config/prisma"));
// GET: Fetch all products (Public - for Catalog)
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 12;
        const search = req.query.search;
        const size = req.query.size;
        const categoryId = req.query.categoryId
            ? parseInt(req.query.categoryId, 10)
            : undefined;
        const status = req.query.status;
        const skip = (page - 1) * limit;
        const whereClause = {};
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
        const [products, totalItems] = await prisma_1.default.$transaction([
            prisma_1.default.product.findMany({
                where: whereClause,
                skip: skip,
                take: limit,
                include: { kategori: true },
                orderBy: { created_at: "desc" },
            }),
            prisma_1.default.product.count({ where: whereClause }),
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
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error });
    }
};
exports.getProducts = getProducts;
// GET: Fetch a single product by ID (Public - for Product Detail)
const getProductById = async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        const product = await prisma_1.default.product.findUnique({
            where: { id: productId },
            include: { kategori: true },
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ data: product });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch product", error });
    }
};
exports.getProductById = getProductById;
// POST: Create a new product (Protected - Admin only)
const createProduct = async (req, res) => {
    try {
        const categoryId = parseInt(req.body.categoryId, 10);
        const price = parseFloat(req.body.price);
        const { name, description, condition, size, status, badge } = req.body;
        const files = req.files;
        const existingProduct = await prisma_1.default.product.findFirst({
            where: { nama_produk: name },
        });
        if (existingProduct) {
            if (files && files.length > 0) {
                files.forEach((file) => {
                    if (fs_1.default.existsSync(file.path)) {
                        fs_1.default.unlinkSync(file.path);
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
        const photoPaths = files.map((file) => `${process.env.UPLOAD_PATH_PRODUCTS}/${file.filename}`);
        const newProduct = await prisma_1.default.product.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create product", error });
    }
};
exports.createProduct = createProduct;
// PUT: Update an existing product (Protected - Admin only)
const updateProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        const existingProduct = await prisma_1.default.product.findUnique({
            where: { id: productId },
        });
        if (!existingProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        const categoryId = req.body.categoryId
            ? parseInt(req.body.categoryId, 10)
            : undefined;
        const price = req.body.price
            ? parseFloat(req.body.price)
            : undefined;
        const { name, description, condition, size, status, badge } = req.body;
        let finalPhotoPaths = existingProduct.foto;
        const originalPhotos = existingProduct.foto;
        const files = req.files;
        if (req.body.retainedPhotos !== undefined || (files && files.length > 0)) {
            let retained = [];
            if (req.body.retainedPhotos) {
                try {
                    retained = JSON.parse(req.body.retainedPhotos);
                }
                catch (e) {
                    retained = Array.isArray(req.body.retainedPhotos)
                        ? req.body.retainedPhotos
                        : [req.body.retainedPhotos];
                }
            }
            const newPhotoPaths = files && files.length > 0
                ? files.map((file) => `${process.env.UPLOAD_PATH_PRODUCTS}/${file.filename}`)
                : [];
            finalPhotoPaths = [...retained, ...newPhotoPaths];
            const photosToDelete = originalPhotos.filter((oldUrl) => !retained.includes(oldUrl));
            photosToDelete.forEach((photoUrl) => {
                const fullPath = path_1.default.join(process.cwd(), "public", photoUrl);
                if (fs_1.default.existsSync(fullPath)) {
                    fs_1.default.unlinkSync(fullPath);
                }
            });
        }
        const updatedProduct = await prisma_1.default.product.update({
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
    }
    catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ message: "Failed to update product", error });
    }
};
exports.updateProduct = updateProduct;
// DELETE: Delete a product (Protected - Admin only)
const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        const product = await prisma_1.default.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        await prisma_1.default.product.delete({
            where: { id: productId },
        });
        const photos = product.foto;
        if (photos && Array.isArray(photos)) {
            photos.forEach((photoUrl) => {
                let cleanPath = photoUrl;
                if (cleanPath.startsWith("public/")) {
                    cleanPath = cleanPath.replace("public/", "");
                }
                if (cleanPath.startsWith("/")) {
                    cleanPath = cleanPath.substring(1);
                }
                const fullPath = path_1.default.join(process.cwd(), "public", cleanPath);
                if (fs_1.default.existsSync(fullPath)) {
                    fs_1.default.unlinkSync(fullPath);
                }
                else {
                    console.warn(`File tidak ditemukan, diabaikan: ${fullPath}`);
                }
            });
        }
        res
            .status(200)
            .json({ message: "Product and associated images successfully deleted!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete product", error });
    }
};
exports.deleteProduct = deleteProduct;
