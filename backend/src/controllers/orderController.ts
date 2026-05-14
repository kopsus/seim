import { Request, Response } from "express";
import prisma from "../config/prisma";
import path from "path";
import fs from "fs";

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerWhatsapp,
      customerAddress,
      paymentMethod,
      codDate,
      items,
    } = req.body;

    // Validasi input awal
    if (!items || items.length === 0) {
      res.status(400).json({ message: "Keranjang belanja kosong." });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      // 1. Looping setiap barang yang dibeli untuk validasi dan update stok
      for (const item of items) {
        // Cari produk utamanya untuk mendapatkan harga
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { sizes: true },
        });

        if (!product) {
          throw new Error(
            `Produk dengan ID ${item.productId} tidak ditemukan.`,
          );
        }

        // Cari varian ukuran yang spesifik
        const productSize = product.sizes.find((s) => s.size === item.size);

        if (!productSize) {
          throw new Error(
            `Ukuran ${item.size} untuk produk ${product.nama_produk} tidak valid.`,
          );
        }

        if (productSize.stock <= 0) {
          throw new Error(
            `Maaf, stok untuk ${product.nama_produk} ukuran ${item.size} sudah habis.`,
          );
        }

        // 2. Kurangi stok ukuran tersebut
        const updatedSize = await tx.productSize.update({
          where: { id: productSize.id },
          data: { stock: productSize.stock - 1 },
        });

        // 3. Cek apakah setelah dibeli ini, semua stok ukuran produk tersebut menjadi habis (0)
        // Kita hitung total stok dari array product.sizes yang lama, dikurangi 1 (yang baru saja dibeli)
        const currentTotalStock = product.sizes.reduce(
          (acc, curr) => acc + curr.stock,
          0,
        );
        const newTotalStock = currentTotalStock - 1;

        if (newTotalStock <= 0) {
          await tx.product.update({
            where: { id: product.id },
            data: { status: "SOLD" },
          });
        }

        totalAmount += Number(product.harga);

        orderItemsData.push({
          product_id: product.id,
          harga_saat_beli: product.harga,
          size: item.size, // <-- KITA SIMPAN UKURAN DI SINI
        });
      }

      const customer = await tx.customer.create({
        data: {
          nama: customerName,
          no_whatsapp: customerWhatsapp,
          alamat: customerAddress,
        },
      });

      const order = await tx.order.create({
        data: {
          customer_id: customer.id,
          total_harga: totalAmount,
          metode_pembayaran: paymentMethod,
          tanggal_cod:
            paymentMethod === "COD" && codDate ? new Date(codDate) : null,
          status_order: "PENDING",
        },
      });

      const finalOrderItems = orderItemsData.map((itemData) => ({
        ...itemData,
        order_id: order.id,
      }));

      await tx.orderItem.createMany({
        data: finalOrderItems,
      });

      return order;
    });

    res.status(201).json({
      message: "Checkout successful! Please complete your payment.",
      data: result,
    });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    res.status(400).json({
      message: "Checkout failed",
      error: error.message || "Terjadi kesalahan saat memproses pesanan.",
    });
  }
};

export const uploadPaymentReceipt = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.id as string;
    const file = req.file as Express.Multer.File;

    if (!file) {
      res
        .status(400)
        .json({ message: "Please upload a payment receipt image." });
      return;
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    if (existingOrder.metode_pembayaran !== "TRANSFER") {
      res
        .status(400)
        .json({ message: "This order uses COD, no receipt needed." });
      return;
    }

    const receiptPath = `${process.env.UPLOAD_PATH_RECEIPTS}/${file.filename}`;

    // Kita hanya update URL buktinya, status tetap PENDING
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        bukti_tf_url: receiptPath,
        status_order: "PENDING",
      },
    });

    res.status(200).json({
      message:
        "Payment receipt successfully uploaded! Please wait for admin confirmation.",
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error("Upload Receipt Error:", error);
    res.status(500).json({
      message: "Failed to upload receipt",
      error: error.message || error,
    });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;
    const whereClause: any = {};

    if (status) {
      whereClause.status_order = status;
    }

    if (search) {
      whereClause.customer = {
        OR: [
          { nama: { contains: search } },
          { no_whatsapp: { contains: search } },
        ],
      };
    }

    const [orders, totalItems] = await prisma.$transaction([
      prisma.order.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.order.count({ where: whereClause }),
    ]);

    res.status(200).json({
      data: orders,
      meta: {
        totalItems: totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true, items: { include: { product: true } } },
    });

    if (!order) {
      res.status(404).json({ message: "order not found" });
      return;
    }

    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.id as string;
    const { status } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status_order: status },
      });

      if (status === "SELESAI" || status === "BATAL") {
        const orderItems = await tx.orderItem.findMany({
          where: { order_id: orderId },
        });

        const productIds = orderItems.map((item) => item.product_id);

        const targetProductStatus = status === "SELESAI" ? "SOLD" : "READY";

        await tx.product.updateMany({
          where: { id: { in: productIds } },
          data: { status: targetProductStatus },
        });
      }

      return updatedOrder;
    });

    res.status(200).json({
      message: `Order status successfully updated to ${status}`,
      data: result,
    });
  } catch (error: any) {
    console.error("Update Order Status Error:", error);
    res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.id as string;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      res.status(404).json({ message: "order not found" });
      return;
    }

    if (order.bukti_tf_url) {
      let cleanPath = order.bukti_tf_url;

      if (cleanPath.startsWith("public/")) {
        cleanPath = cleanPath.replace("public/", "");
      }
      if (cleanPath.startsWith("/")) {
        cleanPath = cleanPath.substring(1);
      }

      const fullPath = path.join(process.cwd(), "public", cleanPath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await prisma.$transaction([
      prisma.orderItem.deleteMany({
        where: { order_id: orderId },
      }),

      prisma.order.delete({
        where: { id: orderId },
      }),
    ]);

    res
      .status(200)
      .json({ message: "Order and associated items successfully deleted!" });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ message: "Failed to delete order", error });
  }
};
