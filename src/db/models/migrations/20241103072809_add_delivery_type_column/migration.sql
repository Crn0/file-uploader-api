-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('upload', 'private', 'authenticated');

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "delivery_type" "DeliveryType" NOT NULL DEFAULT 'upload';
