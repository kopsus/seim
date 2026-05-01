import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware";
import { uploadPhotos } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  verifyToken,
  authorizeRoles("ADMIN"),
  uploadPhotos.array("photos", 5),
  createProduct,
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN"),
  uploadPhotos.array("photos", 5),
  updateProduct,
);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteProduct);

export default router;
