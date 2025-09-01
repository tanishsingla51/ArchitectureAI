-- CreateTable
CREATE TABLE "public"."AuthState" (
    "state" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthState_pkey" PRIMARY KEY ("state")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthState_state_key" ON "public"."AuthState"("state");
