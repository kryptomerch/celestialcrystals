#!/bin/bash

# Deployment script for Celestial Crystals
echo "🚀 Deploying Celestial Crystals..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push database schema (creates tables if they don't exist)
echo "🗄️ Setting up database schema..."
npx prisma db push --accept-data-loss

# Seed database with crystal products
echo "🌱 Seeding database with crystal products..."
npx prisma db seed

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌟 Your website is live at: https://thecelestial.xyz"
