/*
  Warnings:

  - You are about to drop the column `name` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `albums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `albums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `albums` DROP COLUMN `name`,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `images`;

-- CreateTable
CREATE TABLE `urls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
