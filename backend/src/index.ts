import express, { Request, Response } from "express";
import cors from "cors";
import prisma from "./config/prisma";

import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

app.get("/", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      message: "🚀 Server SEIM Backend Berjalan & Database Terhubung!",
    });
  } catch (error) {
    res.status(500).json({ message: "Database gagal terhubung", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
