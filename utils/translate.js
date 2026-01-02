// utils/translate.js
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '..', 'translations.json');
let cache = {};

// load cache if exists
try {
  if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE));
  }
} catch (e) {
  console.warn('Translation cache load error', e);
}

async function translateToEN(text) {
  if (!text) return '';
  if (cache[text]) return cache[text];

  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ml&tl=en&dt=t&q=' + encodeURIComponent(text);
  try {
    const res = await fetch(url);
    const data = await res.json();
    const translated = data[0].map(item => item[0]).join('');
    cache[text] = translated;
    // safe write
    try { fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), { encoding: 'utf8' }); } catch (e) {}
    return translated;
  } catch (err) {
    console.error('Translate failed', err);
    return text; // fallback to original
  }
}

module.exports = translateToEN;
