const express = require('express');
const router = express.Router();
const Reflection = require('../models/Reflection');

// Mock user ID for development
const MOCK_USER_ID = 1;

// Middleware to add mock user for development
const mockAuth = (req, res, next) => {
  req.user = { id: MOCK_USER_ID };
  next();
};

// GET all reflections for the current user
router.get('/', mockAuth, (req, res) => {
  Reflection.getByUserId(req.user.id, (err, reflections) => {
    if (err) {
      console.error('Error fetching reflections:', err);
      return res.status(500).json({ error: 'Failed to fetch reflections' });
    }
    res.json(reflections || []);
  });
});

// GET a specific reflection
router.get('/:id', mockAuth, (req, res) => {
  Reflection.getById(req.params.id, (err, reflection) => {
    if (err) {
      console.error('Error fetching reflection:', err);
      return res.status(500).json({ error: 'Failed to fetch reflection' });
    }
    if (!reflection) {
      return res.status(404).json({ error: 'Reflection not found' });
    }
    res.json(reflection);
  });
});

// Create a new reflection
router.post('/', mockAuth, (req, res) => {
  const { reflection_text, verse_id, chapter_id } = req.body;

  if (!reflection_text) {
    return res.status(400).json({ error: 'Reflection text is required' });
  }
  if (!verse_id && !chapter_id) {
    return res.status(400).json({ error: 'Either verse_id or chapter_id is required' });
  }

  const reflectionData = {
    user_id: req.user.id,
    reflection_text,
    verse_id: verse_id || null,
    chapter_id: verse_id ? null : chapter_id
  };

  Reflection.create(reflectionData, (err, reflection) => {
    if (err) {
      console.error('Error creating reflection:', err);
      return res.status(500).json({ error: 'Failed to create reflection' });
    }
    res.status(201).json(reflection);
  });
});

// Update a reflection
router.put('/:id', mockAuth, (req, res) => {
  const { reflection_text } = req.body;

  if (!reflection_text) {
    return res.status(400).json({ error: 'Reflection text is required' });
  }

  Reflection.update(req.params.id, { reflection_text }, (err, updatedReflection) => {
    if (err) {
      console.error('Error updating reflection:', err);
      return res.status(500).json({ error: 'Failed to update reflection' });
    }
    if (!updatedReflection) {
      return res.status(404).json({ error: 'Reflection not found' });
    }
    res.json(updatedReflection);
  });
});

// Delete a reflection
router.delete('/:id', mockAuth, (req, res) => {
  Reflection.delete(req.params.id, (err) => {
    if (err) {
      console.error('Error deleting reflection:', err);
      return res.status(500).json({ error: 'Failed to delete reflection' });
    }
    res.status(204).send();
  });
});

// Get reflections for a specific verse
router.get('/verse/:verseId', mockAuth, (req, res) => {
  Reflection.getByVerseId(req.params.verseId, req.user.id, (err, reflections) => {
    if (err) {
      console.error('Error fetching verse reflections:', err);
      return res.status(500).json({ error: 'Failed to fetch reflections' });
    }
    res.json(reflections || []);
  });
});

// Get reflections for a specific chapter
router.get('/chapter/:chapterId', mockAuth, (req, res) => {
  Reflection.getByChapterId(req.params.chapterId, req.user.id, (err, reflections) => {
    if (err) {
      console.error('Error fetching chapter reflections:', err);
      return res.status(500).json({ error: 'Failed to fetch reflections' });
    }
    res.json(reflections || []);
  });
});

module.exports = router;
