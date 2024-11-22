/*
  Warnings:

  - Added the required column `version` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "version" TEXT NOT NULL;
