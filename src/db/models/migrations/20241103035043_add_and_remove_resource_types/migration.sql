/*
  Warnings:

  - The values [file] on the enum `ResourceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResourceType_new" AS ENUM ('unknown', 'folder', 'png', 'jpeg', 'jpg', 'webp', 'epub');
ALTER TABLE "files" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "folders" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "folders" ALTER COLUMN "type" TYPE "ResourceType_new" USING ("type"::text::"ResourceType_new");
ALTER TABLE "files" ALTER COLUMN "type" TYPE "ResourceType_new" USING ("type"::text::"ResourceType_new");
ALTER TYPE "ResourceType" RENAME TO "ResourceType_old";
ALTER TYPE "ResourceType_new" RENAME TO "ResourceType";
DROP TYPE "ResourceType_old";
ALTER TABLE "files" ALTER COLUMN "type" SET DEFAULT 'unknown';
ALTER TABLE "folders" ALTER COLUMN "type" SET DEFAULT 'folder';
COMMIT;

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "type" SET DEFAULT 'unknown';
