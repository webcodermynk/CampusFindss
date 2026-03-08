const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const { sendEmail, claimStatusEmail } = require('../utils/email');

// GET all claims
router.get('/', async (req, res) => {
  try { res.json(await Claim.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// GET claims by email
router.get('/by-email/:email', async (req, res) => {
  try {
    const claims = await Claim.find({ claimantEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST new claim
router.post('/', async (req, res) => {
  try {
    const { itemId, itemType, claimantName, claimantEmail, contact, message } = req.body;
    if (!itemId || !claimantName || !contact || !message) {
      return res.status(400).json({ error: 'itemId, claimantName, contact and message are required' });
    }
    const claim = await Claim.create({
      itemId, itemType: itemType || 'found',
      claimantName, claimantEmail: claimantEmail || '',
      contact, message
    });
    res.status(201).json(claim);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT update claim status (with optional email notification)
router.put('/:id', async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['waiting', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status, adminNote: adminNote || '' },
      { new: true }
    );
    if (!claim) return res.status(404).json({ message: 'Claim not found' });

    // Send email if student provided their email
    if (claim.claimantEmail && (status === 'approved' || status === 'rejected')) {
      await sendEmail({
        to: claim.claimantEmail,
        subject: `Your Claim Has Been ${status === 'approved' ? 'Approved ✅' : 'Reviewed'} — CampusFinds`,
        html: claimStatusEmail(claim.claimantName, `Item #${claim.itemId.slice(-5)}`, status, adminNote)
      });
    }

    res.json(claim);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
