const express = require('express');
const router = express.Router();
const { getWeaponData } = require('../services/weaponService');

// Jika hanya `/api/lore`
router.get('/', async (req, res) => {
    try {
        // Panggil `getWeaponData` dengan parameter default 'index'
        const weaponData = await getWeaponData('index');
        res.status(200).json({
            success: true,
            weaponData,
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

// Jika `/api/lore/:name`
router.get('/:name', async (req, res) => {
    const { name } = req.params;

    try {
        // Panggil layanan untuk mendapatkan data lore
        const weaponData = await getWeaponData(name);
        res.status(200).json({
            success: true,
            url: weaponData.source,
            weaponData,
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
