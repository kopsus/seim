import express from "express";
import {
  getAnnouncement,
  upsertAnnouncement,
} from "../controllers/announcementController";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getAnnouncement);

router.put("/", verifyToken, authorizeRoles("ADMIN"), upsertAnnouncement);

export default router;
