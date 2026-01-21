const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const newsController = require('../controllers/newsController');

// lang switch
router.get('/lang/:type', (req,res)=>{
  req.session.lang = (req.params.type === 'en') ? 'en' : 'ml';
  const referer = req.get('Referer') || '/';
  res.redirect(referer);
});

router.get('/', pageController.home);
router.get('/about', pageController.about);
router.get('/priest', pageController.priest);
router.get('/pastors', pageController.pastors);

// gallery
router.get('/gallery', pageController.galleryAlbums);
router.get('/gallery/:branch', pageController.galleryImages);

// news
router.get('/news', newsController.newsList);
router.get('/news/:id', newsController.newsDetail);

module.exports = router;
