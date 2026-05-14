/*
  Warnings:

  - The values [MENUNGGU_KONFIRMASI] on the enum `Order_status_order` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `status_order` ENUM('PENDING', 'DIPROSES', 'SELESAI', 'BATAL') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `Announcement` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'INFO',
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
