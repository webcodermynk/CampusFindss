const express = require('express');
const router = express.Router();
const FoundItems = require('../models/FoundItem'); 

// GET all found items
router.get('/', async (req, res) => {
  try {
    const items = await FoundItems.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new found item
router.post('/', async (req, res) => {
  try {
    const newItem = new FoundItems(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ PUT (Update) a found item by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await FoundItems.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE a found item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await FoundItems.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;