import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Tentukan lokasi folder penyimpanan
const uploadDir = process.env.UPLOAD_PATH_PRODUCTS!;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Simpan ke folder yang kita buat tadi
  },
  filename: (req, file, cb) => {
    const year = new Date().getFullYear();

    const uniqueSuffix =
      year + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const uploadPhotos = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// --- KONFIGURASI UPLOAD BUKTI TRANSFER ---
const receiptDir = process.env.UPLOAD_PATH_RECEIPTS!;

if (!fs.existsSync(receiptDir)) {
  fs.mkdirSync(receiptDir, { recursive: true });
}

const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, receiptDir);
  },
  filename: (req, file, cb) => {
    const year = new Date().getFullYear();
    const uniqueSuffix =
      year + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "receipt-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadReceipt = multer({
  storage: receiptStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
