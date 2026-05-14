import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAnnouncement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: 1 },
    });

    res.status(200).json({
      message: "Announcement retrieved successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Get Announcement Error:", error);
    res.status(500).json({ message: "Failed to fetch announcement", error });
  }
};

export const upsertAnnouncement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, content, type, is_active } = req.body;

    const announcement = await prisma.announcement.upsert({
      where: { id: 1 },
      update: {
        title,
        content,
        type,
        is_active,
      },
      create: {
        id: 1,
        title,
        content,
        type,
        is_active,
      },
    });

    res.status(200).json({
      message: "Announcement updated successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Upsert Announcement Error:", error);
    res.status(500).json({ message: "Failed to update announcement", error });
  }
};
