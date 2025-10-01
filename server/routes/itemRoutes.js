const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET all items
router.get('/', (req, res) => {
  Item.getAll((err, items) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(items);
  });
});

// GET item by ID
router.get('/:id', (req, res) => {
  Item.getById(req.params.id, (err, item) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  });
});

// GET items by user ID
router.get('/user/:userId', (req, res) => {
  Item.getByUserId(req.params.userId, (err, items) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(items);
  });
});

// POST create new item
router.post('/', (req, res) => {
  const { title, description, user_id } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  Item.create({ title, description, user_id }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Item created successfully', itemId: result.id });
  });
});

// PUT update item
router.put('/:id', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  Item.update(req.params.id, { title, description }, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Item updated successfully' });
  });
});

// DELETE item
router.delete('/:id', (req, res) => {
  Item.delete(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

module.exports = router;
