const db = require('../config/database');
const Food = require('./Food');

class Order {
  static async createTable() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        food_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_price DECIMAL(8,2) NOT NULL DEFAULT 0,
        total_price DECIMAL(8,2) NOT NULL DEFAULT 0,
        acknowledged_risk TINYINT(1) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  static async migrateColumns() {
    try {
      await db.execute('ALTER TABLE orders ADD COLUMN unit_price DECIMAL(8,2) NOT NULL DEFAULT 0 AFTER quantity');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') throw error;
    }
    try {
      await db.execute('ALTER TABLE orders ADD COLUMN total_price DECIMAL(8,2) NOT NULL DEFAULT 0 AFTER unit_price');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') throw error;
    }
  }

  static async create({ userId, foodId, quantity, acknowledgedRisk }) {
    const food = await Food.findById(foodId);
    if (!food) throw new Error('Food not found');

    const qty = quantity || 1;
    const unitPrice = Number(food.price);
    const totalPrice = unitPrice * qty;

    const query = `
      INSERT INTO orders (user_id, food_id, quantity, unit_price, total_price, acknowledged_risk)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      userId,
      foodId,
      qty,
      unitPrice,
      totalPrice,
      acknowledgedRisk ? 1 : 0
    ]);
    return { orderId: result.insertId, totalPrice, unitPrice, foodName: food.name };
  }

  static async findByUserId(userId) {
    const query = `
      SELECT o.id, o.quantity, o.unit_price, o.total_price, o.status, o.created_at, o.acknowledged_risk,
             f.name AS food_name, f.image, f.cholesterol, f.category
      FROM orders o
      JOIN foods f ON f.id = o.food_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }
}

module.exports = Order;
