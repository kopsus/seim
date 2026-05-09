"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const orderValidation_1 = require("../validations/orderValidation");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
// PUBLIC ROUTES (Untuk Pelanggan)
router.post("/checkout", (0, validationMiddleware_1.validateBody)(orderValidation_1.checkoutSchema), orderController_1.checkout);
router.post("/:id/upload-receipt", uploadMiddleware_1.uploadReceipt.single("receipt"), orderController_1.uploadPaymentReceipt);
// PROTECTED ROUTES (Untuk Admin & Kasir)
router.get("/", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)("ADMIN", "KASIR"), orderController_1.getOrders);
router.get("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)("ADMIN", "KASIR"), orderController_1.getOrderById);
router.put("/:id/status", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)("ADMIN", "KASIR"), orderController_1.updateOrderStatus);
router.delete("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)("ADMIN"), orderController_1.deleteOrder);
exports.default = router;
