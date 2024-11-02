-- CreateEnum
CREATE TYPE "Role" AS ENUM ('demo', 'user', 'admin');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
