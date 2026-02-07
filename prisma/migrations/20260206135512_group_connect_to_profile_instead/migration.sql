-- DropForeignKey
ALTER TABLE "_UserJoinGroup" DROP CONSTRAINT "_UserJoinGroup_B_fkey";

-- AddForeignKey
ALTER TABLE "_UserJoinGroup" ADD CONSTRAINT "_UserJoinGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
