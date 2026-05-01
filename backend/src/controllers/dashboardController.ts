import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Hitung total pendapatan (Hanya dari pesanan yang 'SELESAI')
    const revenueResult = await prisma.order.aggregate({
      _sum: { total_harga: true },
      where: { status_order: "SELESAI" },
    });
    // Jika belum ada pendapatan, set ke 0
    const totalRevenue = revenueResult._sum.total_harga || 0;

    // Hitung pesanan yang butuh dikonfirmasi kasir
    const pendingOrders = await prisma.order.count({
      where: {
        status_order: { in: ["PENDING", "MENUNGGU_KONFIRMASI"] },
      },
    });

    // Hitung total sepatu yang sudah terjual
    const soldProducts = await prisma.product.count({
      where: { status: "SOLD" },
    });

    // Hitung total sepatu yang masih tersedia
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
