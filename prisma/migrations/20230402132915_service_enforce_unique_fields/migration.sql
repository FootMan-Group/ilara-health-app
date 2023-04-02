/*
  Warnings:

  - A unique constraint covering the columns `[product]` on the table `il_products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_ref]` on the table `il_services` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transaction_type]` on the table `il_tranaction_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payment_ref]` on the table `il_transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "il_products_product_key" ON "il_products"("product");

-- CreateIndex
CREATE UNIQUE INDEX "il_services_service_ref_key" ON "il_services"("service_ref");

-- CreateIndex
CREATE UNIQUE INDEX "il_tranaction_types_transaction_type_key" ON "il_tranaction_types"("transaction_type");

-- CreateIndex
CREATE UNIQUE INDEX "il_transactions_payment_ref_key" ON "il_transactions"("payment_ref");
