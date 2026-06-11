const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Admin {
  static async createTable() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  static async findByUsername(username) {
    const [rows] = await db.execute(
      'SELECT id, username, password, display_name FROM admins WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, username, display_name FROM admins WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async upsert({ username, password, displayName }) {
    const existing = await Admin.findByUsername(username);
    const hashed = await bcrypt.hash(password, 10);

    if (existing) {
      await db.execute(
        'UPDATE admins SET password = ?, display_name = ? WHERE username = ?',
        [hashed, displayName, username]
      );
      return existing.id;
    }

    const [result] = await db.execute(
      'INSERT INTO admins (username, password, display_name) VALUES (?, ?, ?)',
      [username, hashed, displayName]
    );
    return result.insertId;
  }
}

module.exports = Admin;
