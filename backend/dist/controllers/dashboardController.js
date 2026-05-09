"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getDashboardStats = async (req, res) => {
    try {
        const revenueResult = await prisma_1.default.order.aggregate({
            _sum: { total_harga: true },
            where: { status_order: "SELESAI" },
        });
        const totalRevenue = revenueResult._sum.total_harga || 0;
        const pendingOrders = await prisma_1.default.order.count({
            where: {
                status_order: { in: ["PENDING"] },
            },
        });
        const soldProducts = await prisma_1.default.product.count({
            where: { status: "SOLD" },
        });
        const readyProducts = await prisma_1.default.product.count({
            where: { status: "READY" },
        });
        res.status(200).json({
            message: "Dashboard statistics successfully retrieved",
            data: {
                totalRevenue: Number(totalRevenue),
                pendingOrders,
                soldProducts,
                readyProducts,
            },
        });
    }
    catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats", error });
    }
};
exports.getDashboardStats = getDashboardStats;
