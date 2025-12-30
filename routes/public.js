const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");


router.get("/lang/:type", (req, res) => {
  req.session.lang = req.params.type; // ml or en
  res.redirect("back");
});

// Home page
router.get("/", pageController.home);

// About page
router.get("/about", pageController.about);

// Gallery page
router.get("/gallery", pageController.galleryAlbums);
router.get("/gallery/:branch", pageController.galleryImages);


module.exports = router;
