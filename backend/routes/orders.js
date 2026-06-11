const express = require('express');
const Order = require('../models/Order');
const { normalizeOrderList } = require('../utils/normalizeFoodImage');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/orders', authMiddleware, async (req, res) => {
  try {
    const { userId, foodId, quantity, acknowledgedRisk } = req.body;

    if (!userId || !foodId) {
      return res.status(400).json({ message: 'userId and foodId are required' });
    }

    const result = await Order.create({
      userId,
      foodId,
      quantity: quantity || 1,
      acknowledgedRisk: Boolean(acknowledgedRisk)
    });

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: result.orderId,
      totalPrice: result.totalPrice,
      foodName: result.foodName
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/orders/:userId', authMiddleware, async (req, res) => {
  try {
    const orders = normalizeOrderList(await Order.findByUserId(req.params.userId));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
