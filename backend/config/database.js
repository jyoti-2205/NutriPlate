require('dotenv').config();

const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'health_aware_db'
};

const db = mysql.createPool(dbConfig);

async function initDatabase() {
  if (process.env.SKIP_DB_CREATE === 'true') return;

  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await connection.end();
  } catch (error) {
    // Cloud MySQL (Railway etc.) often pre-creates the database
    console.log('Skipping CREATE DATABASE (using existing cloud database)');
  }
}

module.exports = db;
module.exports.initDatabase = initDatabase;
module.exports.dbConfig = dbConfig;
