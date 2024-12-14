const express = require('express');
const router = express.Router();
const { getResonatorData } = require('../services/resonatorService');

// Route untuk crawling resonator
router.get('/:name/:section?', async (req, res) => {
    const { name, section } = req.params;

    try {
        const resonatorData = await getResonatorData(name, section);
        res.json({
            success: true,
            url: resonatorData.source,
            resonatorData,
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch resonator data.' });
    }
});

module.exports = router;
