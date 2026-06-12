const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, cholesterol, sugar, password } = req.body;
    
    const existingUser = await user.findByEmail(name);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userId = await user.create({ name, cholesterol, sugar, password });
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/profile/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { cholesterol, sugar } = req.body;

    if (!userId || cholesterol === undefined || sugar === undefined) {
      return res.status(400).json({ message: 'userId, cholesterol and sugar are required' });
    }

    const chol = Number(cholesterol);
    const sug = Number(sugar);

    if (Number.isNaN(chol) || Number.isNaN(sug) || chol < 0 || sug < 0) {
      return res.status(400).json({ message: 'Cholesterol and sugar must be valid positive numbers' });
    }

    const existing = await user.findById(userId);
    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updated = await user.updateProfile(userId, { cholesterol: chol, sugar: sug });
    res.json({
      message: 'Profile updated successfully',
      user: updated
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    
    const user = await user.findByEmail(name);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, cholesterol: user.cholesterol, sugar: user.sugar }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;