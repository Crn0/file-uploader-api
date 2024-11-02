-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('folder', 'file');

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "type" "ResourceType" NOT NULL DEFAULT 'file';

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "type" "ResourceType" NOT NULL DEFAULT 'folder';
