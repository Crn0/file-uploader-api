/*
  Warnings:

  - Added the required column `extension` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource_type` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Extension" AS ENUM ('unknown', 'png', 'jpeg', 'jpg', 'webp', 'epub');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('image', 'raw');

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "extension" "Extension" NOT NULL,
ADD COLUMN     "resource_type" "ResourceType" NOT NULL;
