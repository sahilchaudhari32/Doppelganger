const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongo');
const initMySQL = require('./scripts/init_mysql');

// Load env variables
dotenv.config();

// Connect routes
const uploadRoutes = require('./routes/uploadRoutes');
const productRoutes = require('./routes/productRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const designRoutes = require('./routes/designRoutes');
const communityRoutes = require('./routes/communityRoutes');
const tryonRoutes = require('./routes/tryonRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for images)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/analyze', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/recommend', recommendationRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/try-on', tryonRoutes);

// Static files for 3D assets (PRD virtual try-on)
app.use('/assets', express.static('assets'));

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Databases THEN start server
const startServer = async () => {
  try {
    await connectDB();
    await initMySQL();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err.message);
    process.exit(1);
  }
};

startServer();
