import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const revenueResult = await prisma.order.aggregate({
      _sum: { total_harga: true },
      where: { status_order: "SELESAI" },
    });
    const totalRevenue = revenueResult._sum.total_harga || 0;

    const pendingOrders = await prisma.order.count({
      where: {
        status_order: { in: ["PENDING"] },
      },
    });

    const soldProducts = await prisma.product.count({
      where: { status: "SOLD" },
    });

    const readyProducts = await prisma.product.count({
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
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats", error });
  }
};
