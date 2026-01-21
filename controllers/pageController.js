const Branch = require('../models/Branch');
const Gallery = require('../models/Gallery');
const News = require('../models/News');

// Helper function to get language from request (query param or localStorage via session)
function getLanguage(req) {
  return req.query.lang || req.session.lang || 'ml';
}

exports.home = async (req, res) => {
  const branches = await Branch.find().lean();

  // Fetch recent news
  const recentNews = await News.find({ status: 'published' })
    .sort({ date: -1 })
    .limit(5)
    .lean();

  res.render('home', { branches, recentNews });
};

exports.about = async (req, res) => {
  const lang = getLanguage(req);
  res.render('about', { lang });
};

// Gallery landing (albums)
exports.galleryAlbums = async (req, res) => {
  const lang = getLanguage(req);
  const branches = await Branch.find().lean();
  
  // Display branch names based on language
  // Each branch has name_ml and name_en from database
  branches.forEach(branch => {
    branch.displayName = lang === 'en' ? (branch.name_en || branch.name_ml) : branch.name_ml;
  });
  
  res.render('gallery-albums', { lang, branches });
};

// Gallery images of branch
exports.galleryImages = async (req, res) => {
  const lang = getLanguage(req);
  const branch = req.params.branch;
  let images;
  
  if (branch === 'common') {
    images = await Gallery.find({ branch: 'COMMON' }).sort({ sortOrder: 1, createdAt: -1 }).lean();
  } else {
    images = await Gallery.find({ branch }).sort({ sortOrder: 1, createdAt: -1 }).lean();
  }

  // IMPORTANT: Do NOT translate here
  // Images must already have both description_ml and description_en in database
  // Just select which one to display based on language
  images.forEach(img => {
    if (lang === 'en') {
      // Use English version (must exist in database)
      img.displayDescription = img.description_en || img.description_ml;
    } else {
      // Use Malayalam version
      img.displayDescription = img.description_ml;
    }
  });

  // resolve branch name for title
  let title = 'Gallery';
  if (branch !== 'common') {
    const br = await Branch.findById(branch);
    title = br ? br.name_ml : 'Gallery';
  } else title = 'Common Gallery';

  res.render('gallery-images', { images, title, lang: req.session.lang || 'ml' });
};

// Priest page
exports.priest = async (req, res) => {
  const lang = getLanguage(req);
  res.render('priest', { lang });
};
// Pastors page
exports.pastors = async (req, res) => {
  const lang = getLanguage(req);
  res.render('pastors', { lang });
};