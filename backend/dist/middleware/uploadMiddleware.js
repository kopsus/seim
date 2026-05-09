"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadReceipt = exports.uploadPhotos = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// 1. Tentukan lokasi folder penyimpanan
const uploadDir = process.env.UPLOAD_PATH_PRODUCTS;
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Simpan ke folder yang kita buat tadi
    },
    filename: (req, file, cb) => {
        const year = new Date().getFullYear();
        const uniqueSuffix = year + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed!"));
    }
};
exports.uploadPhotos = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
// --- KONFIGURASI UPLOAD BUKTI TRANSFER ---
const receiptDir = process.env.UPLOAD_PATH_RECEIPTS;
if (!fs_1.default.existsSync(receiptDir)) {
    fs_1.default.mkdirSync(receiptDir, { recursive: true });
}
const receiptStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, receiptDir);
    },
    filename: (req, file, cb) => {
        const year = new Date().getFullYear();
        const uniqueSuffix = year + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "receipt-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.uploadReceipt = (0, multer_1.default)({
    storage: receiptStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
