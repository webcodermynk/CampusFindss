const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ================= STATIC FILES =================

// uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= API ROUTES =================
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/lost-items', require('./routes/lostItems'));
app.use('/api/found-items', require('./routes/foundItems'));
app.use('/api/claims', require('./routes/claims'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/feedback', require('./routes/feedback'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// ================= FRONTEND SERVE =================

// 👇 correct path to frontend build
const frontendPath = path.join(__dirname, '../frontend/dist');

// serve static files (JS, CSS, images)
app.use(express.static(frontendPath));

// React routing handle (IMPORTANT FIX)
app.get('*', (req, res) => {

  // ❗ if request is for a file (js, css, png, etc.)
  if (req.path.includes('.')) {
    return res.status(404).end();
  }

  // ❗ skip API & uploads
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).end();
  }

  // ✅ serve React app
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CampusFinds running on port ${PORT}`);
});
