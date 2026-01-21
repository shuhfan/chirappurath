require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// Rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Static files - IMPORTANT: serve from public
app.use(express.static(path.join(__dirname, 'public')));

// Views setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✓ MongoDB connected"))
  .catch(err => {
    console.error("✗ MongoDB error:", err.message);
    process.exit(1);
  });

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));

// Translation middleware - makes translation function available to all views
const { t } = require('./config/translations');
app.use((req, res, next) => {
  const lang = req.query.lang || req.session.lang || 'ml';
  res.locals.lang = lang;
  res.locals.t = (key) => t(key, lang);
  next();
});

// Routes
app.use('/', require('./routes/public'));
app.use('/admin', require('./routes/admin'));

// ===== TRANSLATION ENDPOINTS =====
// These endpoints translate content once and store in database
// Translation is NOT done during page rendering (data must be pre-translated)
// Uses LibreTranslate free API: https://libretranslate.com/translate

const { translateToEnglish } = require('./utils/translate');
const Gallery = require('./models/Gallery');
const Branch = require('./models/Branch');

// Translate gallery description and store in database
// Usage: POST /api/translate-gallery
// Body: { "galleryId": "ObjectId" }
app.post('/api/translate-gallery', express.json(), async (req, res) => {
  try {
    const { galleryId } = req.body;
    
    if (!galleryId) {
      return res.status(400).json({ error: 'Missing galleryId' });
    }

    // Find gallery by ID
    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    // Check if already translated
    if (gallery.description_en) {
      console.log('[API] Gallery already has English translation');
      return res.json({ 
        success: true,
        message: 'Already translated',
        description_en: gallery.description_en 
      });
    }

    // Translate and store
    if (gallery.description_ml) {
      console.log('[API] Translating gallery description...');
      const translated = await translateToEnglish(gallery.description_ml);
      gallery.description_en = translated;
      await gallery.save();
      
      console.log('[API] Gallery translation saved to database');
      res.json({ 
        success: true,
        message: 'Translated and stored',
        description_en: translated 
      });
    } else {
      res.json({ 
        success: false,
        message: 'No Malayalam description to translate'
      });
    }
  } catch (error) {
    console.error('[API] Gallery translation error:', error.message);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Translate branch name and store in database
// Usage: POST /api/translate-branch
// Body: { "branchId": "ObjectId" }
app.post('/api/translate-branch', express.json(), async (req, res) => {
  try {
    const { branchId } = req.body;
    
    if (!branchId) {
      return res.status(400).json({ error: 'Missing branchId' });
    }

    // Find branch by ID
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    // Check if already translated
    if (branch.name_en) {
      console.log('[API] Branch already has English translation');
      return res.json({ 
        success: true,
        message: 'Already translated',
        name_en: branch.name_en 
      });
    }

    // Translate and store
    if (branch.name_ml) {
      console.log('[API] Translating branch name...');
      const translated = await translateToEnglish(branch.name_ml);
      branch.name_en = translated;
      await branch.save();
      
      console.log('[API] Branch translation saved to database');
      res.json({ 
        success: true,
        message: 'Translated and stored',
        name_en: translated 
      });
    } else {
      res.json({ 
        success: false,
        message: 'No Malayalam name to translate'
      });
    }
  } catch (error) {
    console.error('[API] Branch translation error:', error.message);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('error', { 
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
