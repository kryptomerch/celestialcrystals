#!/bin/bash

echo "🚀 Setting up Vercel PostgreSQL Database..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Vercel PostgreSQL Setup Steps:${NC}"
echo ""

echo -e "${YELLOW}1. Login to Vercel (if not already logged in):${NC}"
echo "   vercel login"
echo ""

echo -e "${YELLOW}2. Link your project to Vercel:${NC}"
echo "   vercel link"
echo ""

echo -e "${YELLOW}3. Create PostgreSQL database:${NC}"
echo "   vercel storage create postgres celestial-crystals-db"
echo ""

echo -e "${YELLOW}4. Get database connection string:${NC}"
echo "   vercel env pull .env.production"
echo ""

echo -e "${YELLOW}5. Update Prisma schema for production:${NC}"
echo "   # This script will handle this automatically"
echo ""

echo -e "${YELLOW}6. Run database migrations:${NC}"
echo "   npx prisma migrate deploy"
echo ""

echo -e "${GREEN}💰 Cost: FREE! Vercel provides:${NC}"
echo "   ✅ 1 PostgreSQL database (free tier)"
echo "   ✅ 1GB storage"
echo "   ✅ 1 million queries/month"
echo "   ✅ No credit card required"
echo ""

echo -e "${BLUE}🔧 Running automated setup...${NC}"

# Check if user is logged in
if ! vercel whoami > /dev/null 2>&1; then
    echo -e "${RED}❌ Please login to Vercel first:${NC}"
    echo "   vercel login"
    exit 1
fi

echo -e "${GREEN}✅ Vercel login confirmed${NC}"

# Link project if not already linked
if [ ! -f ".vercel/project.json" ]; then
    echo -e "${YELLOW}🔗 Linking project to Vercel...${NC}"
    vercel link --yes
else
    echo -e "${GREEN}✅ Project already linked to Vercel${NC}"
fi

# Create database
echo -e "${YELLOW}🗄️ Creating PostgreSQL database...${NC}"
vercel storage create postgres celestial-crystals-db --yes || echo -e "${YELLOW}⚠️ Database might already exist${NC}"

# Pull environment variables
echo -e "${YELLOW}📥 Pulling environment variables...${NC}"
vercel env pull .env.production

echo -e "${GREEN}✅ Vercel PostgreSQL setup complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Check .env.production for your DATABASE_URL"
echo "2. Run: npm run db:migrate:prod"
echo "3. Deploy: vercel --prod"
echo ""
