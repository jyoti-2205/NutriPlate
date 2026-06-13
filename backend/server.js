const express = require('express');
const cors = require('cors');
const { runSeed } = require('./database/seed');
const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const foodRoutes = require('./routes/foods');
const recommendationRoutes = require('./routes/recommendations');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api', foodRoutes);
app.use('/api', recommendationRoutes);
app.use('/api', orderRoutes);

async function startServer() {
  try {
    const { getDbConnectionLabel, logDbConfig } = require('./config/database');
    logDbConfig();
    console.log(`Connecting to MySQL at ${getDbConnectionLabel()}`);

    await runSeed();

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Run: taskkill /PID <pid> /F`);
      } else {
        console.error('Server error:', error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
