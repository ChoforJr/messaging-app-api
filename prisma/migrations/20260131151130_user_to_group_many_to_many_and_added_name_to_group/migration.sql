/*
  Warnings:

  - You are about to drop the column `joinId` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_joinId_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "joinId";

-- CreateTable
CREATE TABLE "_UserJoinGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserJoinGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserJoinGroup_B_index" ON "_UserJoinGroup"("B");

-- AddForeignKey
ALTER TABLE "_UserJoinGroup" ADD CONSTRAINT "_UserJoinGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserJoinGroup" ADD CONSTRAINT "_UserJoinGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
