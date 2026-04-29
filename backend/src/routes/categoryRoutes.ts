import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getCategories);
router.post("/", verifyToken, authorizeRoles("ADMIN"), createCategory);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateCategory);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteCategory);

export default router;
