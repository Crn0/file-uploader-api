-- DropForeignKey
ALTER TABLE "blacklist_tokens" DROP CONSTRAINT "blacklist_tokens_user_id_fkey";

-- AddForeignKey
ALTER TABLE "blacklist_tokens" ADD CONSTRAINT "blacklist_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
