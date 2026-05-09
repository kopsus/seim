"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.getOrderById = exports.getOrders = exports.uploadPaymentReceipt = exports.checkout = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const checkout = async (req, res) => {
    try {
        const { customerName, customerWhatsapp, customerAddress, paymentMethod, codDate, productIds, } = req.body;
        const result = await prisma_1.default.$transaction(async (tx) => {
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
            const totalAmount = products.reduce((sum, product) => sum + Number(product.harga), 0);
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
                    tanggal_cod: paymentMethod === "COD" && codDate ? new Date(codDate) : null,
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
    }
    catch (error) {
        console.error("Checkout Error:", error);
        res.status(400).json({
            message: "Checkout failed",
            error: error.message || error,
        });
    }
};
exports.checkout = checkout;
const uploadPaymentReceipt = async (req, res) => {
    try {
        const orderId = req.params.id;
        const file = req.file;
        if (!file) {
            res
                .status(400)
                .json({ message: "Please upload a payment receipt image." });
            return;
        }
        const existingOrder = await prisma_1.default.order.findUnique({
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
        const updatedOrder = await prisma_1.default.order.update({
            where: { id: orderId },
            data: {
                bukti_tf_url: receiptPath,
                status_order: "PENDING",
            },
        });
        res.status(200).json({
            message: "Payment receipt successfully uploaded! Please wait for admin confirmation.",
            data: updatedOrder,
        });
    }
    catch (error) {
        console.error("Upload Receipt Error:", error);
        res.status(500).json({
            message: "Failed to upload receipt",
            error: error.message || error,
        });
    }
};
exports.uploadPaymentReceipt = uploadPaymentReceipt;
const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search;
        const status = req.query.status;
        const skip = (page - 1) * limit;
        const whereClause = {};
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
        const [orders, totalItems] = await prisma_1.default.$transaction([
            prisma_1.default.order.findMany({
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
            prisma_1.default.order.count({ where: whereClause }),
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
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await prisma_1.default.order.findUnique({
            where: { id: orderId },
            include: { customer: true, items: { include: { product: true } } },
        });
        if (!order) {
            res.status(404).json({ message: "order not found" });
            return;
        }
        res.status(200).json({ data: order });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch order", error });
    }
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const result = await prisma_1.default.$transaction(async (tx) => {
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
    }
    catch (error) {
        console.error("Update Order Status Error:", error);
        res
            .status(500)
            .json({ message: "Failed to update order status", error: error.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await prisma_1.default.order.findUnique({
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
            const fullPath = path_1.default.join(process.cwd(), "public", cleanPath);
            if (fs_1.default.existsSync(fullPath)) {
                fs_1.default.unlinkSync(fullPath);
            }
        }
        await prisma_1.default.$transaction([
            prisma_1.default.orderItem.deleteMany({
                where: { order_id: orderId },
            }),
            prisma_1.default.order.delete({
                where: { id: orderId },
            }),
        ]);
        res
            .status(200)
            .json({ message: "Order and associated items successfully deleted!" });
    }
    catch (error) {
        console.error("Delete Order Error:", error);
        res.status(500).json({ message: "Failed to delete order", error });
    }
};
exports.deleteOrder = deleteOrder;
