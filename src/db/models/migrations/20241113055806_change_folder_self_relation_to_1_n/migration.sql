/*
  Warnings:

  - You are about to drop the `_folders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_folders" DROP CONSTRAINT "_folders_A_fkey";

-- DropForeignKey
ALTER TABLE "_folders" DROP CONSTRAINT "_folders_B_fkey";

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "parent_id" INTEGER;

-- DropTable
DROP TABLE "_folders";

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
