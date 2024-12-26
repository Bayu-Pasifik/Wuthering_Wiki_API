const express = require('express');
const router = express.Router();
const { getEchoesData } = require('../services/echoService');

// Rute default untuk halaman index faction
router.get('/', async (req, res) => {
    try {
        const echoData = await getEchoesData('index');
        res.status(200).json({
            success: true,
            echoData,
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
        const echoData = await getEchoesData(name);
        res.status(200).json({
            success: true,
            url: echoData.source,
            echoData,
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
