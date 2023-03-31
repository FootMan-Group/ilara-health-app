-- CreateTable
CREATE TABLE "il_users" (
    "id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "employee_names" TEXT NOT NULL,
    "identification_number" TEXT NOT NULL,
    "msisdn" TEXT NOT NULL,
    "refresh_token" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "il_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "il_departments" (
    "id" SERIAL NOT NULL,
    "department_name" TEXT NOT NULL,

    CONSTRAINT "il_departments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "il_users_identification_number_key" ON "il_users"("identification_number");

-- CreateIndex
CREATE UNIQUE INDEX "il_users_msisdn_key" ON "il_users"("msisdn");

-- CreateIndex
CREATE UNIQUE INDEX "il_users_email_key" ON "il_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "il_users_created_by_key" ON "il_users"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "il_users_updated_by_key" ON "il_users"("updated_by");

-- AddForeignKey
ALTER TABLE "il_users" ADD CONSTRAINT "il_users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "il_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "il_users" ADD CONSTRAINT "il_users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "il_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "il_users" ADD CONSTRAINT "il_users_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "il_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
