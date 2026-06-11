const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { adminMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findByUsername(username.trim());
    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        displayName: admin.display_name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/me', adminMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({
      id: admin.id,
      username: admin.username,
      displayName: admin.display_name
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
