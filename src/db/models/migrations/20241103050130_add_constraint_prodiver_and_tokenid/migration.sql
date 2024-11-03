/*
  Warnings:

  - A unique constraint covering the columns `[provider,token_id]` on the table `open_ids` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "open_ids_provider_token_id_key" ON "open_ids"("provider", "token_id");
