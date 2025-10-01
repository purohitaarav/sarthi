const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const Verse = require('../models/Verse');

// ============ CHAPTER ROUTES ============

// GET /api/gita/chapters - Get all chapters
router.get('/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.getAll();
    res.json({
      success: true,
      count: chapters.length,
      data: chapters
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chapters',
      message: error.message
    });
  }
});

// GET /api/gita/chapters/:number - Get specific chapter
router.get('/chapters/:number', async (req, res) => {
  try {
    const chapterNumber = parseInt(req.params.number);
    const chapter = await Chapter.getByChapterNumber(chapterNumber);
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: 'Chapter not found'
      });
    }

    res.json({
      success: true,
      data: chapter
    });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chapter',
      message: error.message
    });
  }
});

// GET /api/gita/chapters/:number/verses - Get all verses of a chapter
router.get('/chapters/:number/verses', async (req, res) => {
  try {
    const chapterNumber = parseInt(req.params.number);
    const chapterWithVerses = await Chapter.getWithVerses(chapterNumber);
    
    if (!chapterWithVerses) {
      return res.status(404).json({
        success: false,
        error: 'Chapter not found'
      });
    }

    res.json({
      success: true,
      data: chapterWithVerses
    });
  } catch (error) {
    console.error('Error fetching chapter verses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chapter verses',
      message: error.message
    });
  }
});

// POST /api/gita/chapters - Create new chapter
router.post('/chapters', async (req, res) => {
  try {
    const { chapter_number, title_sanskrit, title_english, title_transliteration, summary, verse_count } = req.body;

    if (!chapter_number || !title_sanskrit || !title_english) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: chapter_number, title_sanskrit, title_english'
      });
    }

    const result = await Chapter.create({
      chapter_number,
      title_sanskrit,
      title_english,
      title_transliteration,
      summary,
      verse_count
    });

    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating chapter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create chapter',
      message: error.message
    });
  }
});

// PUT /api/gita/chapters/:id - Update chapter
router.put('/chapters/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    await Chapter.update(id, updateData);

    res.json({
      success: true,
      message: 'Chapter updated successfully'
    });
  } catch (error) {
    console.error('Error updating chapter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update chapter',
      message: error.message
    });
  }
});

// DELETE /api/gita/chapters/:id - Delete chapter
router.delete('/chapters/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await Chapter.delete(id);

    res.json({
      success: true,
      message: 'Chapter deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete chapter',
      message: error.message
    });
  }
});

// ============ VERSE ROUTES ============

// GET /api/gita/verses - Get all verses
router.get('/verses', async (req, res) => {
  try {
    const verses = await Verse.getAll();
    res.json({
      success: true,
      count: verses.length,
      data: verses
    });
  } catch (error) {
    console.error('Error fetching verses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verses',
      message: error.message
    });
  }
});

// GET /api/gita/verses/:id - Get specific verse by ID
router.get('/verses/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const verse = await Verse.getById(id);
    
    if (!verse) {
      return res.status(404).json({
        success: false,
        error: 'Verse not found'
      });
    }

    res.json({
      success: true,
      data: verse
    });
  } catch (error) {
    console.error('Error fetching verse:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verse',
      message: error.message
    });
  }
});

// GET /api/gita/chapters/:chapter/verses/:verse - Get specific verse
router.get('/chapters/:chapter/verses/:verse', async (req, res) => {
  try {
    const chapterNumber = parseInt(req.params.chapter);
    const verseNumber = parseInt(req.params.verse);
    
    const verse = await Verse.getByChapterAndVerse(chapterNumber, verseNumber);
    
    if (!verse) {
      return res.status(404).json({
        success: false,
        error: 'Verse not found'
      });
    }

    res.json({
      success: true,
      data: verse
    });
  } catch (error) {
    console.error('Error fetching verse:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verse',
      message: error.message
    });
  }
});

// POST /api/gita/verses - Create new verse
router.post('/verses', async (req, res) => {
  try {
    const { chapter_id, verse_number, sanskrit_text, transliteration, word_meanings, translation_english, purport } = req.body;

    if (!chapter_id || !verse_number || !sanskrit_text || !translation_english) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: chapter_id, verse_number, sanskrit_text, translation_english'
      });
    }

    const result = await Verse.create({
      chapter_id,
      verse_number,
      sanskrit_text,
      transliteration,
      word_meanings,
      translation_english,
      purport
    });

    res.status(201).json({
      success: true,
      message: 'Verse created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating verse:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create verse',
      message: error.message
    });
  }
});

// PUT /api/gita/verses/:id - Update verse
router.put('/verses/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    await Verse.update(id, updateData);

    res.json({
      success: true,
      message: 'Verse updated successfully'
    });
  } catch (error) {
    console.error('Error updating verse:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update verse',
      message: error.message
    });
  }
});

// DELETE /api/gita/verses/:id - Delete verse
router.delete('/verses/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await Verse.delete(id);

    res.json({
      success: true,
      message: 'Verse deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting verse:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete verse',
      message: error.message
    });
  }
});

// ============ SPECIAL ROUTES ============

// GET /api/gita/search?q=query - Search verses
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        error: 'Search query parameter "q" is required'
      });
    }

    const verses = await Verse.search(searchTerm);

    res.json({
      success: true,
      count: verses.length,
      query: searchTerm,
      data: verses
    });
  } catch (error) {
    console.error('Error searching verses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search verses',
      message: error.message
    });
  }
});

// GET /api/gita/random - Get random verse (Verse of the Day)
router.get('/random', async (req, res) => {
  try {
    const verse = await Verse.getRandom();
    
    if (!verse) {
      return res.status(404).json({
        success: false,
        error: 'No verses found'
      });
    }

    res.json({
      success: true,
      data: verse
    });
  } catch (error) {
    console.error('Error fetching random verse:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch random verse',
      message: error.message
    });
  }
});

// GET /api/gita/stats - Get statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Chapter.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

module.exports = router;
