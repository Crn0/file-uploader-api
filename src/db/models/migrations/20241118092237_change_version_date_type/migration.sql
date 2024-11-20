/*
  Warnings:

  - Changed the type of `version` on the `files` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "files" 
ALTER COLUMN "version" TYPE  BIGINT USING "version"::bigint;
