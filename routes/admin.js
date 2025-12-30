const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");

// Admin login
router.get("/login", galleryController.loginPage);
router.post("/login", galleryController.login);

// Middleware to protect admin routes
const isAdmin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

// Admin gallery page
router.get("/gallery", isAdmin, galleryController.adminGallery);

// Upload image
router.post("/gallery/upload", isAdmin, galleryController.uploadImage);

// Delete image
router.post("/gallery/delete/:id", isAdmin, galleryController.deleteImage);

// Logout
router.get("/logout", isAdmin, (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

module.exports = router;
