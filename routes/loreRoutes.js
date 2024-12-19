const express = require('express');
const router = express.Router();
const { getLoreData } = require('../services/loreService');

// Jika hanya `/api/lore`
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Lore API! Use /api/lore/:name to fetch specific lore data.',
        example_urls: [
            '/api/lore/resonators',
            '/api/lore/solaris-3',
        ],
    });
});

// Jika `/api/lore/:name`
router.get('/:name', async (req, res) => {
    const { name } = req.params;

    try {
        // Panggil layanan untuk mendapatkan data lore
        const loreData = await getLoreData(name);
        res.status(200).json({
            success: true,
            url: loreData.source,
            loreData,
        });
    } catch (error) {
        console.error('Error:', error.message);

        const statusCode = error.status_code || 500;

        res.status(statusCode).json({
            success: false,
            status_code: statusCode,
            error: error.message || 'An unexpected error occurred.',
            loreData: {}, // Tetap kosong jika gagal
        });
    }
});

module.exports = router;
