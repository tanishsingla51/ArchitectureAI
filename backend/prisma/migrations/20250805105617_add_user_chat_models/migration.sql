/*
  Warnings:

  - You are about to drop the `Prompt` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Prompt" DROP CONSTRAINT "Prompt_userId_fkey";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "clerkUserId" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Prompt";

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "public"."User"("clerkUserId");

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
