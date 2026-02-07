/*
  Warnings:

  - You are about to drop the column `groupId` on the `Files` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Files" DROP CONSTRAINT "Files_groupId_fkey";

-- DropIndex
DROP INDEX "Files_groupId_key";

-- AlterTable
ALTER TABLE "Files" DROP COLUMN "groupId";
