const Branch = require("../models/Branch");
const Gallery = require("../models/Gallery");
const path = require("path");
const multer = require("multer");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single("image");

// Login page
exports.loginPage = (req, res) => {
    const lang = req.session.lang || "ml";
  res.render("admin/login",{lang});
};

// Login action
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    req.session.admin = true;
    res.redirect("/admin/gallery");
  } else {
    res.render("admin/login", { error: "Invalid login" });
  }
};

// Admin gallery page
exports.adminGallery = async (req, res) => {
  const branches = await Branch.find();
  const images = await Gallery.find().sort({ createdAt: -1 });
    const lang = req.session.lang || "ml";

  res.render("admin/gallery", {
    branches,
    lang,
    images
  });
};

// Upload image
exports.uploadImage = (req, res) => {
  upload(req, res, async err => {
    if (err) {
      return res.send("Upload error");
    }

    const { branch, description_ml } = req.body;

    await Gallery.create({
      imagePath: "/uploads/" + req.file.filename,
      branch,
      description_ml
    });

    res.redirect("/admin/gallery");
  });
};

// Delete image
exports.deleteImage = async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.redirect("/admin/gallery");
};
