// Copy assets script for build process
// This ensures all assets are properly copied to the public directory

import fs from 'fs';
import path from 'path';

const SOURCE_DIR = {
  images: path.resolve('src/assets/images'),
  videos: path.resolve('src/assets/videos')
};

const DEST_DIR = {
  images: path.resolve('public/images'),
  videos: path.resolve('public/videos'),
  assets: path.resolve('public/assets')
};

// Create destination directories if they don't exist
for (const dir of Object.values(DEST_DIR)) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Copy image files
const copyFiles = (sourceDir, destDir, fileType) => {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory doesn't exist: ${sourceDir}`);
    return;
  }

  const files = fs.readdirSync(sourceDir);
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${fileType}: ${file}`);
    }
  }
};

// Copy all assets to their respective directories
copyFiles(SOURCE_DIR.images, DEST_DIR.images, 'image');
copyFiles(SOURCE_DIR.videos, DEST_DIR.videos, 'video');

// Also copy images to the assets directory to handle Vite's asset references
copyFiles(SOURCE_DIR.images, DEST_DIR.assets, 'image to assets');

console.log('All assets copied successfully!');
