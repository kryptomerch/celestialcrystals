#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Source and destination directories
const sourceDir = path.join(__dirname, '..', 'IMAGES');
const destDir = path.join(__dirname, '..', 'public', 'images', 'crystals');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (entry.isFile() && /\.(png|jpg|jpeg|webp|avif)$/i.test(entry.name)) {
      // Only copy image files
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${entry.name} to ${path.relative(process.cwd(), destPath)}`);
    }
  }
}

// Function to get all image files in a directory
function getImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  
  return fs.readdirSync(dir)
    .filter(file => /\.(png|jpg|jpeg|webp|avif)$/i.test(file))
    .sort(); // Sort to ensure consistent ordering
}

// Main sync function
function syncImages() {
  console.log('🔄 Syncing images from IMAGES/ to public/images/crystals/...\n');

  // Get all crystal directories
  const crystalDirs = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const imageMapping = {};

  for (const crystalDir of crystalDirs) {
    const srcPath = path.join(sourceDir, crystalDir);
    const destPath = path.join(destDir, crystalDir);

    console.log(`📁 Processing ${crystalDir}...`);
    
    // Copy all images
    copyDirectory(srcPath, destPath);
    
    // Get list of all images for this crystal
    const images = getImageFiles(destPath);
    if (images.length > 0) {
      imageMapping[crystalDir] = images.map(img => `/images/crystals/${crystalDir}/${img}`);
      console.log(`   Found ${images.length} images: ${images.join(', ')}`);
    }
    
    console.log('');
  }

  // Generate updated crystal data
  console.log('📝 Generating image mapping...\n');
  console.log('Image mapping for crystal data:');
  console.log(JSON.stringify(imageMapping, null, 2));

  // Save mapping to file for reference
  const mappingFile = path.join(__dirname, 'image-mapping.json');
  fs.writeFileSync(mappingFile, JSON.stringify(imageMapping, null, 2));
  console.log(`\n💾 Image mapping saved to: ${mappingFile}`);

  console.log('\n✅ Image sync complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Update src/data/crystals.ts with the new image paths');
  console.log('2. Make sure all crystal entries have their images array populated');
  console.log('3. Test the image loading in your application');
}

// Run the sync
syncImages();
