# 🚀 Complete Setup Instructions - NextGen Jewelry Theme

## Step 1: Install Shopify CLI

### Mac (using Homebrew):
```bash
brew tap shopify/shopify
brew install shopify-cli
```

### Mac/Windows/Linux (using npm):
```bash
npm install -g @shopify/cli @shopify/theme
```

### Verify installation:
```bash
shopify version
```

## Step 2: Create Shopify Partner Account

1. Go to [https://partners.shopify.com](https://partners.shopify.com)
2. Click "Join now" if you don't have an account
3. Fill out the partner application
4. Verify your email address
5. Complete your partner profile

## Step 3: Create Development Store

### Option A: Through Partner Dashboard (Recommended)
1. Log into [Shopify Partners](https://partners.shopify.com)
2. Click "Stores" in the left sidebar
3. Click "Add store"
4. Select "Development store"
5. Choose "Create a new store to test and experiment"
6. Fill out store details:
   - **Store name:** `nextgen-jewelry-demo`
   - **Store URL:** `nextgen-jewelry-demo.myshopify.com`
   - **Purpose:** Testing themes and apps
   - **Industry:** Fashion and apparel
7. Click "Save"

### Option B: Through CLI
```bash
cd /Users/dhruvsmac/Desktop/celestial-crystals/shopify-theme
shopify app generate
# Follow prompts to create development store
```

## Step 4: Connect Theme to Development Store

### Method 1: Using Shopify CLI
```bash
cd /Users/dhruvsmac/Desktop/celestial-crystals/shopify-theme
shopify theme dev --store=nextgen-jewelry-demo.myshopify.com
```

### Method 2: Manual Upload
1. Zip your `shopify-theme` folder
2. In your dev store admin: **Online Store > Themes**
3. Click "Upload theme"
4. Upload the zip file
5. Click "Publish" to make it live

## Step 5: Access Your Theme

Once connected, you'll have:
- **Local preview:** `http://localhost:9292`
- **Live store:** `https://nextgen-jewelry-demo.myshopify.com`
- **Admin:** `https://nextgen-jewelry-demo.myshopify.com/admin`

## Step 6: Add Demo Content

### Quick Demo Setup:
1. Go to your store admin
2. **Products > Add product** (add 10-15 jewelry items)
3. **Collections > Create collection** (Rings, Necklaces, etc.)
4. **Online Store > Navigation** (set up main menu)
5. **Settings > General** (add store info)

### Sample Products to Add:
- Diamond Engagement Ring ($299)
- Gold Chain Necklace ($149)
- Silver Hoop Earrings ($79)
- Pearl Bracelet ($199)
- Sapphire Pendant ($249)

## Step 7: Take Screenshots

### Desktop Screenshot (2000×2496px):
1. Open `https://nextgen-jewelry-demo.myshopify.com`
2. Press F12 → Device toolbar
3. Set custom size: 2000×2496px
4. Take full-page screenshot

### Mobile Screenshot (750×1334px):
1. Set device to iPhone 6/7/8 Plus
2. Take visible area screenshot

### Highlight Images (1600×1200px):
1. Product page features
2. Collection grid layout
3. Cart and checkout process

## Step 8: Create Demo Video

### Recording Setup:
- **Tool:** OBS Studio, Loom, or screen recorder
- **Resolution:** 1920×1080
- **Length:** 60-90 seconds
- **Content:** Homepage → Products → Cart → Mobile view

### Upload to YouTube:
1. Create unlisted video
2. Disable comments and monetization
3. Copy embed URL: `https://www.youtube.com/embed/VIDEO_ID`

## Step 9: Submit to Theme Store

1. Go to [Shopify Partners](https://partners.shopify.com)
2. Click "Themes" → "Submit theme"
3. Fill out the submission form using the data from `SUBMISSION_CHECKLIST.md`
4. Upload all screenshots and video
5. Submit for review

## 🆘 Troubleshooting

### Common Issues:

**"A store is required" error:**
```bash
shopify auth login
shopify theme dev --store=your-store-name.myshopify.com
```

**Theme not uploading:**
- Check internet connection
- Verify store URL is correct
- Try manual upload method

**Screenshots wrong size:**
- Use browser dev tools for exact dimensions
- Try different screenshot tools
- Verify pixel dimensions before uploading

**Demo store not accessible:**
- Remove password protection in Settings > General
- Ensure theme is published, not just uploaded

## 📞 Need Help?

### Resources:
- **Shopify CLI Docs:** https://shopify.dev/docs/themes/tools/cli
- **Theme Store Requirements:** https://shopify.dev/docs/storefronts/themes/store/requirements
- **Partner Support:** Available in Partner Dashboard

### Quick Commands:
```bash
# Check CLI version
shopify version

# Login to Shopify
shopify auth login

# Start development server
shopify theme dev --store=your-store.myshopify.com

# Upload theme
shopify theme push --store=your-store.myshopify.com

# Pull theme from store
shopify theme pull --store=your-store.myshopify.com
```

---

## 🎯 Success Checklist

- [ ] Shopify CLI installed
- [ ] Partner account created
- [ ] Development store created
- [ ] Theme uploaded and published
- [ ] Demo content added
- [ ] Screenshots taken (correct dimensions)
- [ ] Demo video created and uploaded
- [ ] Theme Store submission completed

**You're ready to launch your NextGen Jewelry theme on the Shopify Theme Store!** 🌟💎
