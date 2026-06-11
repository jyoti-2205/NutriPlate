const express = require('express');
const Food = require('../models/Food');
const { getFoodImageUrl } = require('../database/foodImages');
const { normalizeFoodList } = require('../utils/normalizeFoodImage');
const { adminMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/foods', async (req, res) => {
  try {
    const foods = normalizeFoodList(
      await Food.getAll(req.query.filter, req.query.meal_type)
    );
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/foods', adminMiddleware, async (req, res) => {
  try {
    const { name, price, cholesterol, category, meal_type, tags, image } = req.body;

    if (!name || price === undefined || cholesterol === undefined || !category) {
      return res.status(400).json({ message: 'name, price, cholesterol and category are required' });
    }

    const foodId = await Food.create({
      name,
      price: Number(price),
      cholesterol: Number(cholesterol),
      category,
      meal_type: meal_type || 'Veg',
      tags: tags || '',
      image: image || getFoodImageUrl(name)
    });

    const food = await Food.findById(foodId);
    res.status(201).json({ message: 'Food added successfully', food });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/foods/:id', adminMiddleware, async (req, res) => {
  try {
    const deleted = await Food.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
