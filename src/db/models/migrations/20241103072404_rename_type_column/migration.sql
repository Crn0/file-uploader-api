/*
  Warnings:

  - You are about to drop the column `type` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" RENAME COLUMN "type" TO "resource_type"
