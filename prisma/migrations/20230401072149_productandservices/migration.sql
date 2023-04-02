-- CreateTable
CREATE TABLE "il_products" (
    "id" SERIAL NOT NULL,
    "product" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "il_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "il_services" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "units" INTEGER NOT NULL,
    "total_cost" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "il_services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "il_services" ADD CONSTRAINT "il_services_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "il_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "il_services" ADD CONSTRAINT "il_services_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "il_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
