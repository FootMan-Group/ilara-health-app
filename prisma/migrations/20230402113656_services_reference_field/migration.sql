/*
  Warnings:

  - Added the required column `service_ref` to the `il_services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "il_services" ADD COLUMN     "service_ref" TEXT NOT NULL;
