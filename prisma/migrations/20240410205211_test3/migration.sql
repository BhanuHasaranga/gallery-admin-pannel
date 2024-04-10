/*
  Warnings:

  - Added the required column `albumId` to the `urls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `urls` ADD COLUMN `albumId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `urls` ADD CONSTRAINT `urls_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `albums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
