/*
  Warnings:

  - A unique constraint covering the columns `[billingId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `billingId` on table `Enrollment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_billingId_fkey";

-- AlterTable
ALTER TABLE "Enrollment" ALTER COLUMN "billingId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_billingId_key" ON "Enrollment"("billingId");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "Billing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
