"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getCategories = async (req, res) => {
    try {
        const categories = await prisma_1.default.kategori.findMany();
        res.status(200).json({ data: categories });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch categories", error });
    }
};
exports.getCategories = getCategories;
// POST: Create a new category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = await prisma_1.default.kategori.create({
            data: {
                nama_kategori: name,
                deskripsi: description,
            },
        });
        res.status(201).json({
            message: "Category successfully created!",
            data: newCategory,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create category", error });
    }
};
exports.createCategory = createCategory;
// PUT: Update an existing category
const updateCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id, 10);
        const { name, description } = req.body;
        const updatedCategory = await prisma_1.default.kategori.update({
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
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to update category. It might not exist.",
            error,
        });
    }
};
exports.updateCategory = updateCategory;
// DELETE: Delete a category
const deleteCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id, 10);
        await prisma_1.default.kategori.delete({
            where: { id: categoryId },
        });
        res.status(200).json({ message: "Category successfully deleted!" });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to delete category. Ensure no products are using this category.",
            error,
        });
    }
};
exports.deleteCategory = deleteCategory;
