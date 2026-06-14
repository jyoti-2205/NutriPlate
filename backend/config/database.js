require('dotenv').config();

const mysql = require('mysql2/promise');

function resolveDbConfig() {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  if (url) {
    try {
      const parsed = new URL(url);
      return {
        host: parsed.hostname,
        port: Number(parsed.port) || 3306,
        user: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname.replace(/^\//, '') || 'health_aware_db'
      };
    } catch (error) {
      console.warn('Invalid MYSQL_URL/DATABASE_URL, using individual env vars instead');
    }
  }

  const host = process.env.DB_HOST || process.env.MYSQLHOST || '127.0.0.1';

  return {
    host: host === 'localhost' ? '127.0.0.1' : host,
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'health_aware_db'
  };
}

const dbConfig = resolveDbConfig();

const db = mysql.createPool(dbConfig);

async function initDatabase() {
  if (process.env.SKIP_DB_CREATE === 'true' || process.env.RAILWAY_ENVIRONMENT) {
    return;
  }

  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await connection.end();
  } catch (error) {
    console.log('Skipping CREATE DATABASE (using existing cloud database)');
  }
}

function getDbConnectionLabel() {
  return `${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
}

function logDbConfig() {
  const hasMysqlHost = Boolean(process.env.MYSQLHOST || process.env.DB_HOST);
  const hasMysqlUrl = Boolean(process.env.MYSQL_URL || process.env.DATABASE_URL);
  const hasPassword = Boolean(dbConfig.password);

  console.log(`DB config -> host: ${dbConfig.host}, port: ${dbConfig.port}, database: ${dbConfig.database}, user: ${dbConfig.user}`);

  if (process.env.RAILWAY_ENVIRONMENT && !hasMysqlHost && !hasMysqlUrl) {
    console.error('Missing database env vars on Railway. Link MySQL service (MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT).');
  } else if (!process.env.RAILWAY_ENVIRONMENT && !hasPassword) {
    console.error('Missing DB_PASSWORD. Create backend/.env — copy from backend/.env.example and set your MySQL password.');
  }
}

module.exports = db;
module.exports.initDatabase = initDatabase;
module.exports.dbConfig = dbConfig;
module.exports.getDbConnectionLabel = getDbConnectionLabel;
module.exports.logDbConfig = logDbConfig;
