/*
  Warnings:

  - You are about to alter the column `data` on the `images` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `images` MODIFY `data` INTEGER NOT NULL;
