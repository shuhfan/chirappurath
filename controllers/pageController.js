const Branch = require('../models/Branch');
const Gallery = require('../models/Gallery');

// Helper function to get language from request (query param or localStorage via session)
function getLanguage(req) {
  return req.query.lang || req.session.lang || 'ml';
}

exports.home = async (req, res) => {
  const lang = getLanguage(req);
  const branches = await Branch.find().lean();
  res.render('home', { lang, branches });
};

exports.about = async (req, res) => {
  const lang = getLanguage(req);
  
  // Content stored in database (you can add to database later)
  // For now, using static content
  const content_ml = `
കേരളത്തിൽ പ്രാചീന കുടുംബങ്ങളിൽപ്പെട്ട ക്രിസ്ത്യാനികളെല്ലാം, തങ്ങളുടെ ഉത്ഭവം മാർത്തോമ്മാ ശ്ലീഹാ A.D 52- ൽ ഇവിടെ വന്നത് മുതലാണെന്ന് അവകാശപ്പെടുന്നവരും, അതിൽ അഭിമാനിക്കുന്നവരുമാണ്.
`;

  // For 'en' language: show English content from database (not translated on-the-fly)
  // Content_en must be pre-translated and stored in database
  const content_en = `
The ancient Christian families in Kerala, who claim their origin from the arrival of Saint Thomas the Apostle A.D 52, are proud of this fact.
`;
  
  const content = lang === 'en' ? content_en : content_ml;
  res.render('about', { lang, content });
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
