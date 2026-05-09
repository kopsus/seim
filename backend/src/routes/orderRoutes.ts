import { Router } from "express";
import {
  checkout,
  getOrderById,
  getOrders,
  updateOrderStatus,
  uploadPaymentReceipt,
} from "../controllers/orderController";
import { uploadReceipt } from "../middleware/uploadMiddleware";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware";
import { checkoutSchema } from "../validations/orderValidation";
import { validateBody } from "../middleware/validationMiddleware";

const router = Router();

// PUBLIC ROUTES (Untuk Pelanggan)
router.post("/checkout", validateBody(checkoutSchema), checkout);
router.post(
  "/:id/upload-receipt",
  uploadReceipt.single("receipt"),
  uploadPaymentReceipt,
);

// PROTECTED ROUTES (Untuk Admin & Kasir)
router.get("/", verifyToken, authorizeRoles("ADMIN", "KASIR"), getOrders);
router.get("/:id", verifyToken, authorizeRoles("ADMIN", "KASIR"), getOrderById);
router.put(
  "/:id/status",
  verifyToken,
  authorizeRoles("ADMIN", "KASIR"),
  updateOrderStatus,
);

export default router;
