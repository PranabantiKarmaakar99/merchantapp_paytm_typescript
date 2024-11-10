-- CreateTable
CREATE TABLE "merchAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "locked" INTEGER NOT NULL,

    CONSTRAINT "merchAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "locked" INTEGER NOT NULL,

    CONSTRAINT "userAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchAccount_userId_key" ON "merchAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "userAccount_userId_key" ON "userAccount"("userId");

-- AddForeignKey
ALTER TABLE "merchAccount" ADD CONSTRAINT "merchAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAccount" ADD CONSTRAINT "userAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
