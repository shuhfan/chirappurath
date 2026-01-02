const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// lang switch
router.get('/lang/:type', (req,res)=>{
  req.session.lang = (req.params.type === 'en') ? 'en' : 'ml';
  res.redirect('back');
});

router.get('/', pageController.home);
router.get('/about', pageController.about);

// gallery
router.get('/gallery', pageController.galleryAlbums);
router.get('/gallery/:branch', pageController.galleryImages);

module.exports = router;
