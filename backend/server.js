const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/lost-items', require('./routes/lostItems'));
app.use('/api/found-items', require('./routes/foundItems'));
app.use('/api/claims', require('./routes/claims'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/feedback', require('./routes/feedback'));

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// ======================================
// ✅ FRONTEND SERVE (FIXED VERSION)
// ======================================

// static files (JS, CSS, images)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ✅ smart fallback (IMPORTANT FIX)
app.get('*', (req, res, next) => {

  // agar API call hai → skip
  if (req.path.startsWith('/api')) {
    return next();
  }

  // agar static file hai (.js, .css, .png, etc) → skip
  if (req.path.includes('.')) {
    return next();
  }

  // warna React app serve karo
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ======================================

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CampusFinds API running on http://localhost:${PORT}`);
});
