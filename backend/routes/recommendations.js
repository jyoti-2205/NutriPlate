const express = require('express');
const User = require('../models/User');
const Food = require('../models/Food');
const { normalizeFoodList } = require('../utils/normalizeFoodImage');
const { assessFoodRisk } = require('../utils/healthCheck');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/recommend/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const foods = normalizeFoodList(await Food.getAll());
    const analyzed = foods.map((food) => {
      const risk = assessFoodRisk(user, food);
      return {
        ...food,
        isRisky: risk.isRisky,
        status: risk.isRisky ? 'Risky' : 'Safe',
        reasons: risk.reasons
      };
    });

    const recommendations = analyzed.filter((food) => !food.isRisky);

    res.json({
      userHealth: user,
      recommendations,
      summary: {
        totalMenu: foods.length,
        safeCount: recommendations.length,
        riskyCount: analyzed.length - recommendations.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
