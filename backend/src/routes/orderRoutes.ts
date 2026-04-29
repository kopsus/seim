import { Router } from "express";
import {
  checkout,
  getOrders,
  updateOrderStatus,
  uploadPaymentReceipt,
} from "../controllers/orderController";
import { uploadReceipt } from "../middleware/uploadMiddleware";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware";

const router = Router();

// PUBLIC ROUTES (Untuk Pelanggan)
router.post("/checkout", checkout);
router.post(
  "/:id/upload-receipt",
  uploadReceipt.single("receipt"),
  uploadPaymentReceipt,
);

// PROTECTED ROUTES (Untuk Admin & Kasir)
router.get("/", verifyToken, authorizeRoles("ADMIN", "KASIR"), getOrders);
router.put(
  "/:id/status",
  verifyToken,
  authorizeRoles("ADMIN", "KASIR"),
  updateOrderStatus,
);

export default router;
