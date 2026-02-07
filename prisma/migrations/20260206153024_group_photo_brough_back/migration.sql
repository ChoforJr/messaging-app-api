/*
  Warnings:

  - A unique constraint covering the columns `[groupId]` on the table `Files` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "groupId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Files_groupId_key" ON "Files"("groupId");

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
