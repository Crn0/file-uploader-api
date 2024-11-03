/*
  Warnings:

  - You are about to drop the column `format` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "format";

-- DropEnum
DROP TYPE "Format";
