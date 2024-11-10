/*
  Warnings:

  - You are about to drop the column `firstName` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Merchant` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Merchant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;
