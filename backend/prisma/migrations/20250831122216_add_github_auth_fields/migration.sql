/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[githubEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "email",
ADD COLUMN     "githubEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_githubEmail_key" ON "public"."User"("githubEmail");
