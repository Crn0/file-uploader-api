/*
  Warnings:

  - You are about to drop the column `resource_type` on the `files` table. All the data in the column will be lost.
  - The `type` column on the `folders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('folder', 'file');

-- AlterTable
ALTER TABLE "files" DROP COLUMN "resource_type",
ADD COLUMN     "type" "EntityType" NOT NULL DEFAULT 'file';

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "type",
ADD COLUMN     "type" "EntityType" NOT NULL DEFAULT 'folder';

-- DropEnum
DROP TYPE "ResourceType";
