-- Add notifications table for admin dashboard
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL, -- 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'ORDER_CREATED', 'LOW_STOCK'
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "data" JSONB,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "notifications_type_idx" ON "notifications"("type");
CREATE INDEX IF NOT EXISTS "notifications_isRead_idx" ON "notifications"("isRead");
CREATE INDEX IF NOT EXISTS "notifications_createdAt_idx" ON "notifications"("createdAt" DESC);
