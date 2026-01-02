const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

const isAdmin = (req, res, next) => {
  if (req.session && req.session.admin === true) {
    return next();
  }
  res.redirect('/admin/login');
};

// ensure admin routes do not use the public layout
router.use((req, res, next) => {
  res.locals.layout = false;
  next();
});

// Login routes
router.get('/login', (req, res) => {
  if (req.session && req.session.admin) return res.redirect('/admin/gallery');
  res.render('admin/login', { layout: false });
});

router.post('/login', galleryController.login);

// Protected routes
router.get('/logout', isAdmin, galleryController.logout);

// Gallery routes
router.get('/gallery', isAdmin, galleryController.viewGallery);
router.get('/gallery/add', isAdmin, galleryController.addGalleryPage);
router.post('/gallery/upload', isAdmin, galleryController.uploadImage);

router.get('/gallery/edit/:id', isAdmin, galleryController.editImagePage);
router.post('/gallery/edit/:id', isAdmin, galleryController.editImage);

router.post('/gallery/delete/:id', isAdmin, galleryController.deleteImage);

router.get('/reset-inaug', isAdmin, galleryController.resetInaug);

module.exports = router;
