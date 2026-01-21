const News = require('../models/News');

// Get recent news for home page
exports.getRecentNews = async (limit = 5) => {
  try {
    const news = await News.find({ status: 'published' })
      .sort({ date: -1 })
      .limit(limit);
    return news;
  } catch (error) {
    console.error('Error fetching recent news:', error);
    return [];
  }
};

// Public: News listing page
exports.newsList = async (req, res) => {
  try {
    const category = req.query.category || 'all';
    const query = { status: 'published' };

    if (category !== 'all') {
      query.category = category;
    }

    const news = await News.find(query).sort({ date: -1 });

    res.render('news-list', {
      news,
      category,
      lang: req.session.lang || 'ml'
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).render('error', { error: 'Error loading news' });
  }
};

// Public: Single news detail page
exports.newsDetail = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).render('404');
    }

    res.render('news-detail', {
      news,
      lang: req.session.lang || 'ml'
    });
  } catch (error) {
    console.error('Error fetching news detail:', error);
    res.status(500).render('error', { error: 'Error loading news' });
  }
};

// Admin: Get all news
exports.adminNewsList = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.render('admin/news', { news });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).render('error', { error: 'Error loading news' });
  }
};

// Admin: Show add news form
exports.adminAddNewsForm = (req, res) => {
  res.render('admin/add-news');
};

// Admin: Create news
exports.adminCreateNews = async (req, res) => {
  try {
    const newsData = {
      title_ml: req.body.title_ml,
      title_en: req.body.title_en,
      excerpt_ml: req.body.excerpt_ml,
      excerpt_en: req.body.excerpt_en,
      content_ml: req.body.content_ml,
      content_en: req.body.content_en,
      category: req.body.category,
      status: req.body.status || 'published',
      date: req.body.date || Date.now()
    };

    if (req.body.eventDate) {
      newsData.eventDate = req.body.eventDate;
    }

    if (req.body.image) {
      newsData.image = req.body.image;
    }

    await News.create(newsData);
    res.redirect('/admin/news');
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).render('error', { error: 'Error creating news' });
  }
};

// Admin: Show edit news form
exports.adminEditNewsForm = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).render('404');
    }

    res.render('admin/edit-news', { news });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).render('error', { error: 'Error loading news' });
  }
};

// Admin: Update news
exports.adminUpdateNews = async (req, res) => {
  try {
    const updateData = {
      title_ml: req.body.title_ml,
      title_en: req.body.title_en,
      excerpt_ml: req.body.excerpt_ml,
      excerpt_en: req.body.excerpt_en,
      content_ml: req.body.content_ml,
      content_en: req.body.content_en,
      category: req.body.category,
      status: req.body.status,
      date: req.body.date
    };

    if (req.body.eventDate) {
      updateData.eventDate = req.body.eventDate;
    }

    if (req.body.image) {
      updateData.image = req.body.image;
    }

    await News.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin/news');
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).render('error', { error: 'Error updating news' });
  }
};

// Admin: Delete news
exports.adminDeleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.redirect('/admin/news');
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).render('error', { error: 'Error deleting news' });
  }
};
