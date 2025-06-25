/*
  Warnings:

  - You are about to drop the column `locationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RelatedLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_policeStationId_fkey";

-- DropForeignKey
ALTER TABLE "RelatedLocation" DROP CONSTRAINT "RelatedLocation_locationAId_fkey";

-- DropForeignKey
ALTER TABLE "RelatedLocation" DROP CONSTRAINT "RelatedLocation_locationBId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_locationId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "locationId",
ADD COLUMN     "officeId" TEXT;

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "RelatedLocation";
