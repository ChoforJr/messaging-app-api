-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_adminId_fkey";

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
