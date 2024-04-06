/*
  Warnings:

  - You are about to alter the column `data` on the `images` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `images` MODIFY `data` VARCHAR(191) NOT NULL;
