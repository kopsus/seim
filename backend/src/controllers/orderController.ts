import { Request, Response } from "express";
import prisma from "../config/prisma";

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerWhatsapp,
      customerAddress,
      paymentMethod,
      codDate,
      productIds,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      if (products.length !== productIds.length) {
        throw new Error("Some products were not found.");
      }
      const isAllReady = products.every((p) => p.status === "READY");
      if (!isAllReady) {
        throw new Error("One or more products are already SOLD.");
      }

      const totalAmount = products.reduce(
        (sum, product) => sum + Number(product.harga),
        0,
      );

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
        },
      });

      const orderItemsData = products.map((product) => ({
        order_id: order.id,
        product_id: product.id,
        harga_saat_beli: product.harga,
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
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
      error: error.message || error,
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

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        bukti_tf_url: receiptPath,
        status_order: "MENUNGGU_KONFIRMASI",
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
