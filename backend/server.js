require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Connect to database
connectDB();

const app = express();

const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 200
});
app.use(limiter);

// Prevent HTTP param pollution
app.use(hpp());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/academic', require('./src/routes/academicRoutes'));
app.use('/api/staff', require('./src/routes/staffRoutes'));
app.use('/api/admission', require('./src/routes/admissionRoutes'));
app.use('/api/student', require('./src/routes/studentRoutes'));
app.use('/api/attendance', require('./src/routes/attendanceRoutes'));
app.use('/api/mentor', require('./src/routes/mentorRoutes'));
app.use('/api/finance', require('./src/routes/financeRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// Serve static uploaded files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Route
app.get('/', (req, res) => {
  res.send('CampuSync API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
