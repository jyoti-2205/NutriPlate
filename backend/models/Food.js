const db = require('../config/database');



class Food {

  static async createTable() {

    await db.execute(`

      CREATE TABLE IF NOT EXISTS foods (

        id INT AUTO_INCREMENT PRIMARY KEY,

        name VARCHAR(100) NOT NULL,

        price DECIMAL(8,2) NOT NULL DEFAULT 0,

        cholesterol DECIMAL(5,2) NOT NULL,

        image VARCHAR(500) NOT NULL,

        category ENUM('Safe', 'Risky') NOT NULL,

        meal_type VARCHAR(20) DEFAULT 'Non-Veg',

        tags VARCHAR(255) DEFAULT '',

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      )

    `);

  }



  static async migrateColumns() {

    try {

      await db.execute('ALTER TABLE foods ADD COLUMN price DECIMAL(8,2) NOT NULL DEFAULT 0 AFTER name');

    } catch (error) {

      if (error.code !== 'ER_DUP_FIELDNAME') throw error;

    }



    try {

      await db.execute('ALTER TABLE foods MODIFY COLUMN image VARCHAR(500) NOT NULL');

    } catch (error) {

      // ignore if already correct type

    }



    try {

      await db.execute("ALTER TABLE foods ADD COLUMN meal_type VARCHAR(20) DEFAULT 'Non-Veg' AFTER category");

    } catch (error) {

      if (error.code !== 'ER_DUP_FIELDNAME') throw error;

    }



    try {

      await db.execute("ALTER TABLE foods ADD COLUMN tags VARCHAR(255) DEFAULT '' AFTER meal_type");

    } catch (error) {

      if (error.code !== 'ER_DUP_FIELDNAME') throw error;

    }

  }



  static async getAll(filter, mealType) {

    let query = 'SELECT id, name, price, cholesterol, image, category, meal_type, tags FROM foods';

    const conditions = [];

    const params = [];



    if (filter === 'safe') conditions.push("category = 'Safe'");

    else if (filter === 'risky') conditions.push("category = 'Risky'");



    if (mealType && mealType !== 'all') {

      conditions.push('meal_type = ?');

      params.push(mealType);

    }



    if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;

    query += ' ORDER BY id';



    const [rows] = await db.execute(query, params);

    return rows;

  }



  static async findById(id) {

    const [rows] = await db.execute(

      'SELECT id, name, price, cholesterol, image, category, meal_type, tags FROM foods WHERE id = ?',

      [id]

    );

    return rows[0];

  }



  static async create(food) {

    const [result] = await db.execute(

      `INSERT INTO foods (name, price, cholesterol, image, category, meal_type, tags)

       VALUES (?, ?, ?, ?, ?, ?, ?)`,

      [

        food.name,

        food.price,

        food.cholesterol,

        food.image,

        food.category,

        food.meal_type || 'Non-Veg',

        food.tags || ''

      ]

    );

    return result.insertId;

  }



  static async delete(id) {

    const [result] = await db.execute('DELETE FROM foods WHERE id = ?', [id]);

    return result.affectedRows > 0;

  }



  static async count() {

    const [rows] = await db.execute('SELECT COUNT(*) AS total FROM foods');

    return rows[0].total;

  }

}



module.exports = Food;

