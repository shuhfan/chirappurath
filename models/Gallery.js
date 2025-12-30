const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  imagePath: {
    type: String,
    required: true
  },
  branch: {
    type: String, // "COMMON" or Branch ID
    required: true
  },
  description_ml: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Gallery", gallerySchema);
