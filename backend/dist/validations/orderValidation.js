"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutSchema = void 0;
const zod_1 = require("zod");
exports.checkoutSchema = zod_1.z
    .object({
    customerName: zod_1.z
        .string({ message: "Customer name is required" })
        .min(3, "Name must be at least 3 characters long"),
    customerWhatsapp: zod_1.z
        .string({ message: "WhatsApp number is required" })
        .min(10, "WhatsApp number is too short")
        .max(15, "WhatsApp number is too long")
        .regex(/^[0-9]+$/, "WhatsApp must contain only numbers"),
    customerAddress: zod_1.z
        .string({ message: "Address is required" })
        .min(10, "Address must be at least 10 characters long"),
    paymentMethod: zod_1.z.enum(["TRANSFER", "COD"], {
        message: "Invalid payment method",
    }),
    codDate: zod_1.z.string().optional(),
    productIds: zod_1.z
        .array(zod_1.z.number(), { message: "Product IDs are required" })
        .min(1, "You must select at least one product to checkout"),
})
    .refine((data) => {
    if (data.paymentMethod === "COD") {
        return data.codDate !== undefined && data.codDate.trim() !== "";
    }
    return true;
}, {
    message: "Date is required when choosing COD (Ambil di toko)",
    path: ["codDate"],
});
