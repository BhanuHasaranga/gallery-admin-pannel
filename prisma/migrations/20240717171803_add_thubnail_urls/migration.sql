/*
  Warnings:

  - A unique constraint covering the columns `[thumbnailId]` on the table `urls` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `urls` ADD COLUMN `thumbnailId` INTEGER NULL;

-- CreateTable
CREATE TABLE `thumbnailUrls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `thumbnailUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `urls_thumbnailId_key` ON `urls`(`thumbnailId`);

-- AddForeignKey
ALTER TABLE `urls` ADD CONSTRAINT `urls_thumbnailId_fkey` FOREIGN KEY (`thumbnailId`) REFERENCES `thumbnailUrls`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
