import { z } from "zod";

export const checkoutSchema = z
  .object({
    customerName: z
      .string({ message: "Customer name is required" })
      .min(3, "Name must be at least 3 characters long"),

    customerWhatsapp: z
      .string({ message: "WhatsApp number is required" })
      .min(10, "WhatsApp number is too short")
      .max(15, "WhatsApp number is too long")
      .regex(/^[0-9]+$/, "WhatsApp must contain only numbers"),

    customerAddress: z
      .string({ message: "Address is required" })
      .min(10, "Address must be at least 10 characters long"),

    paymentMethod: z.enum(["TRANSFER", "COD"], {
      message: "Invalid payment method",
    }),

    codDate: z.string().optional(),

    items: z
      .array(
        z.object({
          productId: z.string({ message: "Product ID is required" }),
          size: z.string({ message: "Size is required" }),
        }),
      )
      .min(1, "You must select at least one product to checkout"),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "COD") {
        return data.codDate !== undefined && data.codDate.trim() !== "";
      }
      return true;
    },
    {
      message: "Date is required when choosing COD (Ambil di toko)",
      path: ["codDate"],
    },
  );
