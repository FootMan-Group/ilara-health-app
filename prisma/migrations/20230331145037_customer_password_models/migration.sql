/*
  Warnings:

  - Added the required column `password` to the `il_customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "il_customers" ADD COLUMN     "password" TEXT NOT NULL;
