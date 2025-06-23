/*
  Warnings:

  - You are about to drop the column `officeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `District` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Division` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PoliceStation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Zone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserRoles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[officeName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `officeName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_stateId_fkey";

-- DropForeignKey
ALTER TABLE "Division" DROP CONSTRAINT "Division_zoneId_fkey";

-- DropForeignKey
ALTER TABLE "PoliceStation" DROP CONSTRAINT "PoliceStation_divisionId_fkey";

-- DropForeignKey
ALTER TABLE "Zone" DROP CONSTRAINT "Zone_districtId_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "officeId",
ADD COLUMN     "officeName" TEXT NOT NULL,
ADD COLUMN     "phoneNo" TEXT,
ADD COLUMN     "roleId" INTEGER NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "District";

-- DropTable
DROP TABLE "Division";

-- DropTable
DROP TABLE "PoliceStation";

-- DropTable
DROP TABLE "State";

-- DropTable
DROP TABLE "Zone";

-- DropTable
DROP TABLE "_UserRoles";

-- CreateTable
CREATE TABLE "FlowMap" (
    "id" TEXT NOT NULL,
    "currentUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlowMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowNextUser" (
    "id" TEXT NOT NULL,
    "flowMapId" TEXT NOT NULL,
    "nextUserId" TEXT NOT NULL,

    CONSTRAINT "FlowNextUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionHistory" (
    "id" TEXT NOT NULL,
    "flowMapId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_officeName_key" ON "User"("officeName");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNo_key" ON "User"("phoneNo");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowMap" ADD CONSTRAINT "FlowMap_currentUserId_fkey" FOREIGN KEY ("currentUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowNextUser" ADD CONSTRAINT "FlowNextUser_nextUserId_fkey" FOREIGN KEY ("nextUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowNextUser" ADD CONSTRAINT "FlowNextUser_flowMapId_fkey" FOREIGN KEY ("flowMapId") REFERENCES "FlowMap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionHistory" ADD CONSTRAINT "ActionHistory_flowMapId_fkey" FOREIGN KEY ("flowMapId") REFERENCES "FlowMap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionHistory" ADD CONSTRAINT "ActionHistory_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionHistory" ADD CONSTRAINT "ActionHistory_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
