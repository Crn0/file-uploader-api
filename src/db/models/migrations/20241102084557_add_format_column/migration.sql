/*
  Warnings:

  - Added the required column `format` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Format" AS ENUM ('unknown', 'jpg', 'png', 'webp', 'epub');

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "format" "Format" NOT NULL;
