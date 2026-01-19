/**
 * Translation Helper for Admin
 * This file shows how to translate existing content using the API endpoints
 * 
 * Run from Node.js console or add to admin panel
 */

// Example 1: Translate a single gallery item
async function translateGalleryItem(galleryId) {
  const response = await fetch('/api/translate-gallery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ galleryId })
  });
  
  const data = await response.json();
  console.log('[Translation] Result:', data);
  return data;
}

// Example 2: Translate a single branch
async function translateBranch(branchId) {
  const response = await fetch('/api/translate-branch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branchId })
  });
  
  const data = await response.json();
  console.log('[Translation] Result:', data);
  return data;
}

// Example 3: Translate all galleries (backend only)
// This should be called from Node.js server, not browser
async function translateAllGalleries() {
  const Gallery = require('../models/Gallery');
  const { translateToEnglish } = require('../utils/translate');
  
  const galleries = await Gallery.find();
  let translated = 0;
  let skipped = 0;
  
  for (const gallery of galleries) {
    if (!gallery.description_en && gallery.description_ml) {
      console.log(`[Translating] ${gallery._id}`);
      gallery.description_en = await translateToEnglish(gallery.description_ml);
      await gallery.save();
      translated++;
    } else {
      skipped++;
    }
  }
  
  console.log(`[Complete] Translated: ${translated}, Skipped: ${skipped}`);
}

// Example 4: Translate all branches (backend only)
async function translateAllBranches() {
  const Branch = require('../models/Branch');
  const { translateToEnglish } = require('../utils/translate');
  
  const branches = await Branch.find();
  let translated = 0;
  let skipped = 0;
  
  for (const branch of branches) {
    if (!branch.name_en && branch.name_ml) {
      console.log(`[Translating] ${branch._id}`);
      branch.name_en = await translateToEnglish(branch.name_ml);
      await branch.save();
      translated++;
    } else {
      skipped++;
    }
  }
  
  console.log(`[Complete] Translated: ${translated}, Skipped: ${skipped}`);
}

module.exports = {
  translateGalleryItem,
  translateBranch,
  translateAllGalleries,
  translateAllBranches
};
