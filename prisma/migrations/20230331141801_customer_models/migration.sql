-- CreateTable
CREATE TABLE "il_customers" (
    "id" SERIAL NOT NULL,
    "identification_number" TEXT NOT NULL,
    "customer_names" TEXT NOT NULL,
    "msisdn" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "il_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "il_tranaction_types" (
    "id" SERIAL NOT NULL,
    "transaction_type" TEXT NOT NULL,

    CONSTRAINT "il_tranaction_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "il_transactions" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "transaction_type_id" INTEGER,
    "payment_ref" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "transaction_timestamp" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,
    "payer_name" TEXT NOT NULL,
    "payer_number" TEXT,
    "source" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "il_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "il_customers_identification_number_key" ON "il_customers"("identification_number");

-- CreateIndex
CREATE UNIQUE INDEX "il_customers_msisdn_key" ON "il_customers"("msisdn");

-- CreateIndex
CREATE UNIQUE INDEX "il_customers_email_key" ON "il_customers"("email");

-- AddForeignKey
ALTER TABLE "il_transactions" ADD CONSTRAINT "il_transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "il_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "il_transactions" ADD CONSTRAINT "il_transactions_transaction_type_id_fkey" FOREIGN KEY ("transaction_type_id") REFERENCES "il_tranaction_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
