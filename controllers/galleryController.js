const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');

const Branch = require('../models/Branch');
const Gallery = require('../models/Gallery');

// storage config
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `img-${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG, PNG, WebP images allowed'));
}

const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } 
}).single('image');

// Helper: delete uploaded files
function deleteFiles(paths) {
  paths.forEach(filePath => {
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } 
      catch (e) { console.warn(`Failed to delete ${filePath}`); }
    }
  });
}

// admin login view
exports.loginPage = (req, res) => res.render('admin/login', { layout: false });

// login action (use env)
exports.login = (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.render('admin/login', { 
      error: 'Username and password required',
      layout: false 
    });
  }
  
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    req.session.admin = true;
    req.session.save(() => {
      res.redirect('/admin/gallery');
    });
  } else {
    res.render('admin/login', { 
      error: 'Invalid username or password',
      layout: false 
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/admin/login');
  });
};

// Add gallery page
exports.addGalleryPage = async (req, res) => {
  const branches = await Branch.find().lean();
  res.render('admin/add-gallery', { branches, layout: false });
};

// View gallery page
exports.viewGallery = async (req, res) => {
  const images = await Gallery.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.render('admin/view-gallery', { images, layout: false });
};

// Upload image
exports.uploadImage = (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) return res.status(400).render('admin/add-gallery', { 
        branches: await Branch.find(), 
        error: err.message,
        layout: false
      });

      const { branch, description_ml, sortOrder } = req.body;
      if (!req.file) return res.status(400).send('No file uploaded');

      const filename = req.file.filename;
      const originalPath = path.join(uploadDir, filename);

      // Use separate filenames for resized image and thumbnail to avoid "same file" error
      const resizedName = `res-${filename}`;
      const resizedPath = path.join(uploadDir, resizedName);
      const thumbName = `thumb-${filename}`;
      const thumbPath = path.join(uploadDir, thumbName);

      // Create resized image (write to a new file), then create thumbnail from resized file
      await sharp(originalPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .toFile(resizedPath);

      await sharp(resizedPath)
        .resize({ width: 600 })
        .toFile(thumbPath);

      // Remove the original uploaded file to save space
      try { fs.unlinkSync(originalPath); } catch (e) { /* ignore */ }

      // Save to DB using resized + thumb
      await Gallery.create({
        imagePath: `/uploads/${resizedName}`,
        thumbPath: `/uploads/${thumbName}`,
        branch: branch || 'COMMON',
        description_ml: description_ml?.trim() || '',
        sortOrder: Number(sortOrder) || 0
      });

      res.redirect('/admin/gallery');
    } catch (e) {
      console.error('Upload error:', e);

      // attempt to clean any files that may have been created
      const toRemove = [];
      if (req.file && req.file.filename) {
        toRemove.push(path.join(uploadDir, req.file.filename));
        toRemove.push(path.join(uploadDir, `res-${req.file.filename}`));
        toRemove.push(path.join(uploadDir, `thumb-${req.file.filename}`));
      }
      deleteFiles(toRemove);

      res.status(500).render('admin/add-gallery', { 
        branches: await Branch.find(), 
        error: 'Upload failed',
        layout: false
      });
    }
  });
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const img = await Gallery.findById(id);
    if (!img) return res.redirect('/admin/gallery');

    const filesToDelete = [
      path.join(__dirname, '..', 'public', img.imagePath),
      img.thumbPath ? path.join(__dirname, '..', 'public', img.thumbPath) : null
    ].filter(Boolean);

    deleteFiles(filesToDelete);
    await Gallery.findByIdAndDelete(id);
    res.redirect('/admin/gallery');
  } catch (e) {
    console.error('Delete error:', e);
    res.status(500).send('Delete failed');
  }
};

// Edit page (GET)
exports.editImagePage = async (req, res) => {
  const id = req.params.id;
  const img = await Gallery.findById(id).lean();
  if (!img) return res.redirect('/admin/gallery');
  const branches = await Branch.find().lean();
  res.render('admin/edit-gallery', { img, branches, layout: false });
};

// Edit action (POST)
exports.editImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { description_ml, sortOrder, branch } = req.body;
    
    await Gallery.findByIdAndUpdate(id, {
      description_ml: description_ml?.trim() || '',
      sortOrder: Number(sortOrder) || 0,
      branch: branch || 'COMMON'
    });
    
    res.redirect('/admin/gallery');
  } catch (e) {
    console.error('Edit error:', e);
    res.status(500).send('Edit failed');
  }
};

// Reset inauguration overlay on admin browser
exports.resetInaug = (req, res) => {
  // sends a small page that when opened will clear localStorage and redirect home
  res.send(`
    <html>
      <body>
        <script>
          localStorage.removeItem('inaugurated');
          window.location.href = '/';
        </script>
      </body>
    </html>
  `);
};
