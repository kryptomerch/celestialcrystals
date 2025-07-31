#!/bin/bash

echo "🔄 Migrating to PostgreSQL..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production not found!${NC}"
    echo "Please run the Vercel setup script first:"
    echo "   bash scripts/setup-vercel-db.sh"
    exit 1
fi

# Backup current schema
echo -e "${YELLOW}📋 Backing up current Prisma schema...${NC}"
cp prisma/schema.prisma prisma/schema.prisma.backup

# Update schema for PostgreSQL
echo -e "${YELLOW}🔧 Updating Prisma schema for PostgreSQL...${NC}"
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# Generate Prisma client
echo -e "${YELLOW}⚙️ Generating Prisma client...${NC}"
npx prisma generate

# Create migration
echo -e "${YELLOW}📝 Creating initial migration...${NC}"
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2- | tr -d '"')
export DATABASE_URL

npx prisma migrate dev --name init --create-only

# Deploy migration to production
echo -e "${YELLOW}🚀 Deploying migration to production...${NC}"
npx prisma migrate deploy

# Seed database if seed script exists
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
    echo -e "${YELLOW}🌱 Seeding production database...${NC}"
    npx prisma db seed
fi

echo -e "${GREEN}✅ PostgreSQL migration complete!${NC}"
echo ""
echo -e "${BLUE}📊 Database Status:${NC}"
echo "   ✅ Schema: PostgreSQL"
echo "   ✅ Migrations: Applied"
echo "   ✅ Client: Generated"
echo ""
echo -e "${YELLOW}🔄 To switch back to SQLite for local development:${NC}"
echo "   cp prisma/schema.prisma.backup prisma/schema.prisma"
echo "   npx prisma generate"
echo ""
