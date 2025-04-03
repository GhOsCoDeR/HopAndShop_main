/*
  Warnings:

  - You are about to alter the column `category` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `description` TEXT NOT NULL,
    MODIFY `image` TEXT NOT NULL,
    MODIFY `category` VARCHAR(100) NOT NULL;
