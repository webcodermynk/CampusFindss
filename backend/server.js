const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= API ROUTES =================
app.use('/api/users',       require('./routes/users'));
app.use('/api/admin',       require('./routes/admin'));
app.use('/api/lost-items',  require('./routes/lostItems'));
app.use('/api/found-items', require('./routes/foundItems'));
app.use('/api/claims',      require('./routes/claims'));
app.use('/api/contact',     require('./routes/contact'));
app.use('/api/analytics',   require('./routes/analytics'));
app.use('/api/feedback',    require('./routes/feedback'));
app.use('/api/settings',    require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// ================= CRON LOGIC =================
const FoundItem  = require('./models/FoundItem');
const LostItem   = require('./models/LostItem');
const Claim      = require('./models/Claim');
const Settings   = require('./models/Settings');

const getSetting = async (key, fallback = null) => {
  const doc = await Settings.findOne({ key }).catch(() => null);
  return doc ? doc.value : fallback;
};

// Claim Auto Delete
async function runClaimAutoDelete() {
  try {
    const enabled = await getSetting('claimAutoDeleteEnabled', false);
    if (!enabled) return;

    const days   = Number(await getSetting('claimAutoDeleteDays', 10));
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const expiredClaims = await Claim.find({
      status: 'approved',
      updatedAt: { $lte: cutoff }
    });

    if (!expiredClaims.length) return;

    const itemIds = expiredClaims.map(c => c.itemId);

    const result = await FoundItem.deleteMany({
      _id: { $in: itemIds },
      status: 'claimed'
    });

    await Claim.deleteMany({ itemId: { $in: itemIds } });

    if (result.deletedCount > 0) {
      console.log(`🗑️ Removed ${result.deletedCount} claimed items`);
    }
  } catch (err) {
    console.error('❌ Claim Auto Delete Error:', err.message);
  }
}

// Data Retention
async function runDataRetention() {
  try {
    const enabled = await getSetting('dataRetentionEnabled', false);
    if (!enabled) return;

    const days   = Number(await getSetting('dataRetentionDays', 90));
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const foundResult = await FoundItem.deleteMany({
      status: 'found',
      createdAt: { $lte: cutoff }
    });

    const lostResult = await LostItem.deleteMany({
      createdAt: { $lte: cutoff }
    });

    const total = foundResult.deletedCount + lostResult.deletedCount;

    if (total > 0) {
      console.log(`🗑️ Removed ${total} old items`);
    }
  } catch (err) {
    console.error('❌ Data Retention Error:', err.message);
  }
}

// Run cron jobs
runClaimAutoDelete();
runDataRetention();

setInterval(runClaimAutoDelete, 60 * 60 * 1000);
setInterval(runDataRetention,   60 * 60 * 1000);

// ================= FRONTEND SERVE (VITE FIX) =================
if (process.env.NODE_ENV === 'production') {
  // IMPORTANT: Vite build output = dist
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
