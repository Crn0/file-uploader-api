/*
  Warnings:

  - You are about to alter the column `version` on the `files` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "files" ALTER COLUMN "version" SET DATA TYPE INTEGER;
