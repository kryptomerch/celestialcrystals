-- Add blog tables for AI-generated content

-- Blog posts table
CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "featuredImage" TEXT,
    "author" TEXT NOT NULL DEFAULT 'CELESTIAL Team',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "readingTime" INTEGER NOT NULL DEFAULT 5,
    "isAIGenerated" BOOLEAN NOT NULL DEFAULT true,
    "seoScore" INTEGER DEFAULT 85,
    "targetKeywords" TEXT,
    "internalLinks" TEXT,
    "externalLinks" TEXT,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS "BlogCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#9333ea',
    "icon" TEXT,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- Blog tags table
CREATE TABLE IF NOT EXISTS "BlogTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("id")
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS "BlogComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogComment_pkey" PRIMARY KEY ("id")
);

-- Blog analytics table
CREATE TABLE IF NOT EXISTS "BlogAnalytics" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "timeOnPage" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "source" TEXT,
    "country" TEXT,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogAnalytics_pkey" PRIMARY KEY ("id")
);

-- SEO tracking table
CREATE TABLE IF NOT EXISTS "BlogSEO" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "position" INTEGER,
    "searchVolume" INTEGER,
    "difficulty" INTEGER,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogSEO_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "BlogCategory_slug_key" ON "BlogCategory"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "BlogTag_slug_key" ON "BlogTag"("slug");

-- Create regular indexes for performance
CREATE INDEX IF NOT EXISTS "BlogPost_status_publishDate_idx" ON "BlogPost"("status", "publishDate");
CREATE INDEX IF NOT EXISTS "BlogPost_category_idx" ON "BlogPost"("category");
CREATE INDEX IF NOT EXISTS "BlogPost_isAIGenerated_idx" ON "BlogPost"("isAIGenerated");
CREATE INDEX IF NOT EXISTS "BlogComment_postId_idx" ON "BlogComment"("postId");
CREATE INDEX IF NOT EXISTS "BlogComment_status_idx" ON "BlogComment"("status");
CREATE INDEX IF NOT EXISTS "BlogAnalytics_postId_date_idx" ON "BlogAnalytics"("postId", "date");
CREATE INDEX IF NOT EXISTS "BlogSEO_postId_keyword_idx" ON "BlogSEO"("postId", "keyword");

-- Add foreign key constraints
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BlogComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BlogAnalytics" ADD CONSTRAINT "BlogAnalytics_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BlogSEO" ADD CONSTRAINT "BlogSEO_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default blog categories
INSERT INTO "BlogCategory" ("id", "name", "slug", "description", "color", "icon") VALUES
('cat_crystal_guides', 'Crystal Guides', 'crystal-guides', 'Complete guides to individual crystals and their healing properties', '#9333ea', 'gem'),
('cat_chakra_healing', 'Chakra Healing', 'chakra-healing', 'Learn about chakra balancing and crystal healing for energy centers', '#ec4899', 'circle-dot'),
('cat_how_to', 'How-To Guides', 'how-to-guides', 'Step-by-step tutorials for crystal healing practices', '#06b6d4', 'book-open'),
('cat_seasonal', 'Seasonal Healing', 'seasonal-healing', 'Crystal rituals and practices for different seasons', '#10b981', 'calendar'),
('cat_birthstones', 'Birthstone Guides', 'birthstone-guides', 'Monthly birthstone information and zodiac crystal recommendations', '#f59e0b', 'star'),
('cat_meditation', 'Crystal Meditation', 'crystal-meditation', 'Meditation techniques and practices with healing crystals', '#8b5cf6', 'brain'),
('cat_wellness', 'Wellness & Lifestyle', 'wellness-lifestyle', 'Incorporating crystal healing into daily wellness routines', '#ef4444', 'heart')
ON CONFLICT ("id") DO NOTHING;

-- Insert default blog tags
INSERT INTO "BlogTag" ("id", "name", "slug", "description") VALUES
('tag_healing', 'Crystal Healing', 'crystal-healing', 'Posts about crystal healing properties and benefits'),
('tag_meditation', 'Meditation', 'meditation', 'Crystal meditation techniques and practices'),
('tag_chakra', 'Chakra', 'chakra', 'Chakra balancing and energy healing content'),
('tag_wellness', 'Wellness', 'wellness', 'General wellness and spiritual health topics'),
('tag_beginner', 'Beginner Guide', 'beginner-guide', 'Content for those new to crystal healing'),
('tag_advanced', 'Advanced', 'advanced', 'Advanced crystal healing techniques'),
('tag_protection', 'Protection', 'protection', 'Crystals for protection and negative energy clearing'),
('tag_love', 'Love & Relationships', 'love-relationships', 'Crystals for love, relationships, and emotional healing'),
('tag_abundance', 'Abundance', 'abundance', 'Crystals for prosperity, success, and manifestation'),
('tag_spiritual', 'Spiritual Growth', 'spiritual-growth', 'Crystals for spiritual development and consciousness'),
('tag_cleansing', 'Crystal Cleansing', 'crystal-cleansing', 'How to cleanse and charge your crystals'),
('tag_jewelry', 'Crystal Jewelry', 'crystal-jewelry', 'Information about crystal bracelets, necklaces, and accessories')
ON CONFLICT ("id") DO NOTHING;
