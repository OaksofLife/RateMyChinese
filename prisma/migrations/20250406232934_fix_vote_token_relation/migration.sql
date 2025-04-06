-- DropForeignKey
ALTER TABLE "VoteToken" DROP CONSTRAINT "VoteToken_videoId_fkey";

-- AlterTable
ALTER TABLE "VoteToken" ALTER COLUMN "videoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "VoteToken" ADD CONSTRAINT "VoteToken_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;
