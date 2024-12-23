const express = require('express');
const router = express.Router();
const { getFactionData } = require('../services/factionService');

// Rute default untuk halaman index faction
router.get('/', async (req, res) => {
    try {
        const factionData = await getFactionData('factions');
        res.status(200).json({
            success: true,
            factionData,
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'An unexpected error occurred.',
        });
    }
});

// Rute dinamis untuk faction detail
router.get('/:name', async (req, res) => {
    const { name } = req.params;

    try {
        // Panggil layanan untuk mendapatkan data lore
        const factionData = await getFactionData(name);
        res.status(200).json({
            success: true,
            url: factionData.source,
            factionData,
        });
    } catch (error) {
        console.error('Error:', error.message);

        const statusCode = error.status_code || 500;

        res.status(statusCode).json({
            success: false,
            status_code: statusCode,
            error: error.message || 'An unexpected error occurred.',
            weaponData: {}, // Tetap kosong jika gagal
        });
    }
});


module.exports = router;
