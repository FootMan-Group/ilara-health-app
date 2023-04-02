/*
  Warnings:

  - Added the required column `account_ref` to the `il_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_id` to the `il_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "il_transactions" ADD COLUMN     "account_ref" TEXT NOT NULL,
ADD COLUMN     "service_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "il_transactions" ADD CONSTRAINT "il_transactions_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "il_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
