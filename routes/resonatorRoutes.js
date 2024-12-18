const express = require('express');
const router = express.Router();
const { getResonatorData } = require('../services/resonatorService');

// Route untuk crawling resonator
router.get('/:name/:section?', async (req, res) => {
    const { name, section } = req.params;

    try {
        // Panggil layanan untuk mendapatkan data resonator
        const resonatorData = await getResonatorData(name, section);
        res.status(200).json({
            success: true,
            url: resonatorData.source,
            resonatorData,
        });
    } catch (error) {
        console.error('Error:', error.message);

        // Ambil status code langsung dari error, default ke 500 jika tidak ada
        const statusCode = error.status_code || 500;

        res.status(statusCode).json({
            success: false,
            status_code: statusCode,
            error: error.message || 'An unexpected error occurred.',
            resonatorData: {}, // Tetap kosong jika gagal
        });
    }
});

module.exports = router;
