-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripeSessionId" TEXT,
    "status" TEXT NOT NULL,
    "designJson" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "shippingName" TEXT,
    "shippingAddressLine1" TEXT,
    "shippingAddressLine2" TEXT,
    "shippingCity" TEXT,
    "shippingPostalCode" TEXT,
    "shippingCountry" TEXT,
    "pdfPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");
