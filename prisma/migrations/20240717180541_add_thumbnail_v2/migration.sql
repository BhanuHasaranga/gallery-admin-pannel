/*
  Warnings:

  - You are about to drop the column `thumbnailId` on the `urls` table. All the data in the column will be lost.
  - You are about to drop the `thumbnailurls` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `urls` DROP FOREIGN KEY `urls_thumbnailId_fkey`;

-- AlterTable
ALTER TABLE `urls` DROP COLUMN `thumbnailId`,
    ADD COLUMN `thumbnail` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `thumbnailurls`;
