const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

router.get('/:itemId', async (req, res) => {
  try {
    const url = `${process.env.CLIENT_URL || 'http://localhost:3000'}/item/${req.params.itemId}`;
    const qr = await QRCode.toDataURL(url, { width: 300, margin: 2, color: { dark: '#1e293b', light: '#ffffff' } });
    res.json({ qr, url });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
