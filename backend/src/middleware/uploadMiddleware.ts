import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Tentukan lokasi folder penyimpanan
const uploadDir = process.env.UPLOAD_PATH!;

// Cek apakah folder sudah ada, jika belum otomatis buatkan
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Konfigurasi penyimpanan file
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

// 3. Filter agar hanya file gambar yang bisa di-upload
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

// 4. Gabungkan konfigurasi dan batasi ukuran file (maksimal 5MB per foto)
export const uploadPhotos = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
