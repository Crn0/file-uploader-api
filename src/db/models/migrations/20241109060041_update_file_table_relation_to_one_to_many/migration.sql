/*
  Warnings:

  - You are about to drop the `_FileToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `owner_id` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_FileToUser" DROP CONSTRAINT "_FileToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FileToUser" DROP CONSTRAINT "_FileToUser_B_fkey";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_FileToUser";

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
