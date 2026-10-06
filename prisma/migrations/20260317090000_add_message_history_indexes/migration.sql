CREATE INDEX "Message_authorId_createdAt_idx" ON "Message"("authorId", "createdAt");

CREATE INDEX "Message_toUserId_createdAt_idx" ON "Message"("toUserId", "createdAt");

CREATE INDEX "Message_toGroupId_createdAt_idx" ON "Message"("toGroupId", "createdAt");
