const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { initDatabase } = require('../config/database');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Food = require('../models/Food');
const Order = require('../models/Order');
const { sampleFoods, SAMPLE_PASSWORD } = require('./foodCatalog');
const { ADMIN_ACCOUNTS } = require('./adminCatalog');

const sampleUsers = [
  { name: 'arun_sharma', cholesterol: 180, sugar: 95 },
  { name: 'priya_verma', cholesterol: 210, sugar: 140 },
  { name: 'rahul_mehta', cholesterol: 165, sugar: 88 },
  { name: 'anita_singh', cholesterol: 195, sugar: 110 },
  { name: 'vikram_patel', cholesterol: 240, sugar: 155 },
  { name: 'neha_gupta', cholesterol: 150, sugar: 82 },
  { name: 'amit_kumar', cholesterol: 220, sugar: 130 },
  { name: 'kavita_reddy', cholesterol: 175, sugar: 99 },
  { name: 'sanjay_iyer', cholesterol: 190, sugar: 105 },
  { name: 'deepa_nair', cholesterol: 160, sugar: 90 },
  { name: 'rohit_malhotra', cholesterol: 205, sugar: 125 },
  { name: 'meera_joshi', cholesterol: 145, sugar: 78 },
  { name: 'karan_desai', cholesterol: 230, sugar: 148 },
  { name: 'pooja_agarwal', cholesterol: 170, sugar: 92 },
  { name: 'manish_chopra', cholesterol: 185, sugar: 100 },
  { name: 'ritu_bansal', cholesterol: 155, sugar: 85 },
  { name: 'ajay_thakur', cholesterol: 250, sugar: 160 },
  { name: 'sonia_kapoor', cholesterol: 200, sugar: 115 },
  { name: 'devesh_rana', cholesterol: 140, sugar: 75 },
  { name: 'nisha_pandey', cholesterol: 175, sugar: 98 },
  { name: 'harsh_tiwari', cholesterol: 215, sugar: 135 },
  { name: 'lakshmi_menon', cholesterol: 165, sugar: 87 },
  { name: 'gaurav_bhatia', cholesterol: 190, sugar: 102 },
  { name: 'shruti_dubey', cholesterol: 150, sugar: 80 },
  { name: 'imran_khan', cholesterol: 225, sugar: 142 },
  { name: 'aditi_rao', cholesterol: 160, sugar: 89 },
  { name: 'yash_saxena', cholesterol: 180, sugar: 96 },
  { name: 'tanvi_shah', cholesterol: 195, sugar: 108 },
  { name: 'om_prakash', cholesterol: 170, sugar: 91 },
  { name: 'divya_kulkarni', cholesterol: 145, sugar: 77 }
];

async function seedFoods() {
  await Food.migrateColumns();

  for (const food of sampleFoods) {
    const [rows] = await db.execute('SELECT id FROM foods WHERE name = ?', [food.name]);
    if (rows.length > 0) {
      await db.execute(
        'UPDATE foods SET price = ?, cholesterol = ?, image = ?, category = ?, meal_type = ?, tags = ? WHERE name = ?',
        [food.price, food.cholesterol, food.image, food.category, food.meal_type, food.tags, food.name]
      );
    } else {
      await db.execute(
        'INSERT INTO foods (name, price, cholesterol, image, category, meal_type, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [food.name, food.price, food.cholesterol, food.image, food.category, food.meal_type, food.tags]
      );
    }
  }

  console.log(`Food catalog updated (${sampleFoods.length} items — images matched by name)`);
}

async function seedUsers() {
  const [rows] = await db.execute('SELECT COUNT(*) AS total FROM users');
  if (rows[0].total >= 20) return;

  const hashedPassword = await bcrypt.hash(SAMPLE_PASSWORD, 10);
  const query = 'INSERT INTO users (name, cholesterol, sugar, password) VALUES (?, ?, ?, ?)';

  for (const sampleUser of sampleUsers) {
    const existing = await User.findByEmail(sampleUser.name);
    if (!existing) {
      await db.execute(query, [sampleUser.name, sampleUser.cholesterol, sampleUser.sugar, hashedPassword]);
    }
  }
  console.log(`Seeded ${sampleUsers.length} users (password: ${SAMPLE_PASSWORD})`);
}

async function seedAdmins() {
  await Admin.createTable();
  for (const account of ADMIN_ACCOUNTS) {
    await Admin.upsert({
      username: account.username,
      password: account.password,
      displayName: account.displayName
    });
  }
  console.log(`Admin accounts ready (${ADMIN_ACCOUNTS.length} admins)`);
}

async function runSeed() {
  await initDatabase();
  await User.createTable();
  await Admin.createTable();
  await Food.createTable();
  await Order.createTable();
  await Order.migrateColumns();
  await seedFoods();
  await seedUsers();
  await seedAdmins();
  console.log('Database seed completed');
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seed failed:', error.message);
      process.exit(1);
    });
}

module.exports = { runSeed, sampleUsers, sampleFoods, SAMPLE_PASSWORD };
