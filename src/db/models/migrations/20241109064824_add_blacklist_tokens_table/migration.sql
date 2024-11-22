-- CreateTable
CREATE TABLE "blacklist_tokens" (
    "id" SERIAL NOT NULL,
    "jwt_id" VARCHAR(36) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires_in" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blacklist_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklist_tokens_jwt_id_key" ON "blacklist_tokens"("jwt_id");

-- AddForeignKey
ALTER TABLE "blacklist_tokens" ADD CONSTRAINT "blacklist_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
