/*
  Warnings:

  - Added the required column `stock_count` to the `il_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "il_products" ADD COLUMN     "stock_count" INTEGER NOT NULL;
