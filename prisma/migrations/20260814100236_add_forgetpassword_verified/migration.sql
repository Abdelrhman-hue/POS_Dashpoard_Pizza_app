-- CreateTable
CREATE TABLE "ForgetpasswordToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ForgetpasswordToken_token_key" ON "ForgetpasswordToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ForgetpasswordToken_identifier_token_key" ON "ForgetpasswordToken"("identifier", "token");
