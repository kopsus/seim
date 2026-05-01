import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/userValidation";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validationMiddleware";

const router = Router();

router.use(verifyToken, authorizeRoles("ADMIN"));

router.get("/", getUsers);
router.post("/", validateBody(createUserSchema), createUser);
router.put("/:id", validateBody(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
