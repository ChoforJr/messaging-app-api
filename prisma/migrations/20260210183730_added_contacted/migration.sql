-- CreateTable
CREATE TABLE "_contacted" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_contacted_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_contacted_B_index" ON "_contacted"("B");

-- AddForeignKey
ALTER TABLE "_contacted" ADD CONSTRAINT "_contacted_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_contacted" ADD CONSTRAINT "_contacted_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
