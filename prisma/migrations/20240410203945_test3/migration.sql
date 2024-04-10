/*
  Warnings:

  - You are about to drop the column `title` on the `albums` table. All the data in the column will be lost.
  - Added the required column `name` to the `albums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `albums` DROP COLUMN `title`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
