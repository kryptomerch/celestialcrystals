#!/bin/bash

echo "🚀 NextGen Jewelry Theme Setup"
echo "================================"

# Make script executable
chmod +x setup-demo.sh

# Check if Shopify CLI is installed
if ! command -v shopify &> /dev/null; then
    echo "❌ Shopify CLI not found. Installing..."
    npm install -g @shopify/cli @shopify/theme
else
    echo "✅ Shopify CLI found"
fi

# Check if we're in the right directory
if [ ! -f "config/settings_data.json" ]; then
    echo "❌ Not in theme directory. Please run from shopify-theme folder"
    exit 1
fi

echo "✅ In theme directory"

# Start development server
echo "🔄 Starting Shopify theme development server..."
echo ""
echo "📝 NEXT STEPS:"
echo "   1. Log in to your Shopify Partner account when prompted"
echo "   2. Select 'Create new development store' or use existing one"
echo "   3. Store name suggestion: 'nextgen-jewelry-demo'"
echo "   4. Wait for theme to upload (may take 2-3 minutes)"
echo ""
echo "🌐 Your theme will be available at:"
echo "   - Local preview: http://localhost:9292"
echo "   - Live store: [your-store-name].myshopify.com"
echo ""
echo "📸 For screenshots, use the live store URL"
echo ""

shopify theme dev
