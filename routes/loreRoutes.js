const express = require('express');
const router = express.Router();
const { getLoreData } = require('../services/loreService');

// Jika hanya `/api/lore`
router.get('/', async (req, res) => {
    try {
        // Panggil `getLoreData` dengan parameter default 'index'
        const loreData = await getLoreData('index');
        res.status(200).json({
            success: true,
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
