import { Router } from "express";
import { checkout, uploadPaymentReceipt } from "../controllers/orderController";
import { uploadReceipt } from "../middleware/uploadMiddleware";

const router = Router();

router.post("/checkout", checkout);
router.post(
  "/:id/upload-receipt",
  uploadReceipt.single("receipt"),
  uploadPaymentReceipt,
);

export default router;
