const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        cholesterol DECIMAL(5,2),
        sugar DECIMAL(5,2),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.execute(query);
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const query = `INSERT INTO users (name, cholesterol, sugar, password) VALUES (?, ?, ?, ?)`;
    const [result] = await db.execute(query, [
      userData.name,
      userData.cholesterol,
      userData.sugar,
      hashedPassword
    ]);
    return result.insertId;
  }

  static async findByEmail(name) {
    const query = `SELECT * FROM users WHERE name = ?`;
    const [rows] = await db.execute(query, [name]);
    return rows[0];
  }

  static async findById(id) {
    const query = `SELECT id, name, cholesterol, sugar FROM users WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async updateProfile(id, { cholesterol, sugar }) {
    const query = `UPDATE users SET cholesterol = ?, sugar = ? WHERE id = ?`;
    await db.execute(query, [cholesterol, sugar, id]);
    return User.findById(id);
  }
}

module.exports = User;