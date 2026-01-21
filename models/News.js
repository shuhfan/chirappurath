const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title_ml: {
    type: String,
    required: true,
    trim: true
  },
  title_en: {
    type: String,
    trim: true
  },
  excerpt_ml: {
    type: String,
    required: true,
    trim: true
  },
  excerpt_en: {
    type: String,
    trim: true
  },
  content_ml: {
    type: String,
    required: true
  },
  content_en: {
    type: String
  },
  image: {
    type: String,
    default: '/images/news-default.jpg'
  },
  category: {
    type: String,
    enum: ['news', 'event', 'announcement', 'obituary'],
    default: 'news'
  },
  date: {
    type: Date,
    default: Date.now
  },
  eventDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
newsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('News', newsSchema);
