const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Claim = require('../models/Claim');
const Contact = require('../models/Contact');

// GET /api/analytics — returns all dashboard analytics data
router.get('/', async (req, res) => {
  try {
    const [lostItems, foundItems, claims, contacts] = await Promise.all([
      LostItem.find(), FoundItem.find(), Claim.find(), Contact.find()
    ]);

    // Weekly items (last 8 weeks)
    const weeklyData = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(); start.setDate(start.getDate() - i * 7); start.setHours(0,0,0,0);
      const end = new Date(start); end.setDate(end.getDate() + 7);
      weeklyData.push({
        week: `Wk ${8 - i}`,
        lost: lostItems.filter(it => new Date(it.createdAt) >= start && new Date(it.createdAt) < end).length,
        found: foundItems.filter(it => new Date(it.createdAt) >= start && new Date(it.createdAt) < end).length,
      });
    }

    // Category breakdown
    const catCount = {};
    [...lostItems, ...foundItems].forEach(it => { const c = it.category || 'Other'; catCount[c] = (catCount[c] || 0) + 1; });
    const categoryData = Object.entries(catCount).sort((a,b) => b[1]-a[1]).map(([name, value]) => ({ name, value }));

    // Claim status pie
    const claimStatusData = [
      { name: 'Approved', value: claims.filter(c => c.status === 'approved').length },
      { name: 'Rejected', value: claims.filter(c => c.status === 'rejected').length },
      { name: 'Pending',  value: claims.filter(c => c.status === 'waiting').length },
    ].filter(c => c.value > 0);

    // Monthly trend (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear(); const m = d.getMonth();
      monthlyData.push({
        month,
        lost:  lostItems.filter(it => { const d2 = new Date(it.createdAt); return d2.getMonth()===m && d2.getFullYear()===year; }).length,
        found: foundItems.filter(it => { const d2 = new Date(it.createdAt); return d2.getMonth()===m && d2.getFullYear()===year; }).length,
        claims: claims.filter(c => { const d2 = new Date(c.createdAt); return d2.getMonth()===m && d2.getFullYear()===year; }).length,
      });
    }

    // Summary
    const resolved = claims.filter(c => c.status === 'approved').length;
    const total = lostItems.length + foundItems.length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.json({ weeklyData, categoryData, claimStatusData, monthlyData, summary: {
      totalItems: total, resolved, resolutionRate,
      totalClaims: claims.length, totalFeedback: contacts.length,
      pendingFeedback: contacts.filter(c => c.status === 'pending').length,
    }});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/analytics/ai-matches — AI item matching suggestions
router.get('/ai-matches', async (req, res) => {
  try {
    const [lost, found] = await Promise.all([
      LostItem.find({ status: { $ne: 'returned' } }).limit(50),
      FoundItem.find({ status: { $ne: 'returned' } }).limit(50)
    ]);

    const tokenize = (text) => (text || '').toLowerCase().replace(/[^a-z0-9\s]/g,'').split(/\s+/).filter(Boolean);
    const similarity = (a, b) => {
      const ta = new Set(tokenize(`${a.title} ${a.description} ${a.category} ${a.location}`));
      const tb = new Set(tokenize(`${b.title} ${b.description} ${b.category} ${b.location}`));
      const inter = [...ta].filter(x => tb.has(x)).length;
      const union = new Set([...ta, ...tb]).size;
      return union === 0 ? 0 : inter / union;
    };

    const matches = [];
    lost.forEach(l => {
      found.forEach(f => {
        const score = similarity(l, f);
        if (score >= 0.15) {
          matches.push({ lostItem: l, foundItem: f, score: Math.round(score * 100) });
        }
      });
    });

    matches.sort((a, b) => b.score - a.score);
    res.json(matches.slice(0, 20));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
