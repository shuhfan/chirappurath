const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  imagePath: {
    type: String,
    required: true
  },
  thumbPath: {
    type: String,
    default: null
  },
  branch: {
    type: String,
    default: 'COMMON'
  },
  description_ml: {
    type: String,
    default: ''
  },
  description_en: {
    type: String,
    default: ''
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Gallery", gallerySchema);
