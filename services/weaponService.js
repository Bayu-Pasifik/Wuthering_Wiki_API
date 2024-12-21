const axios = require('axios');
const cheerio = require('cheerio');

const getWeaponData = async (name) => {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid "name" parameter. It must be a non-empty string.');
    }

    // Ubah 'index' menjadi 'lore' untuk URL
    const baseUrlName = name === 'index' ? 'weapons' : name;
    const baseUrl = `https://wutheringwaves.fandom.com/wiki/${baseUrlName}`;
    const sectionName = name.toLowerCase();

    try {
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);

        let sectionHandler;

        // Explicitly check for 'index' and import the correct handler
        if (sectionName === 'index') {
            sectionHandler = require('./sections/weapons/index.js');
        } else {
            try {
                // Coba impor file sesuai section
                const sectionPath = `./sections/weapons/${sectionName}.js`;
                sectionHandler = require(sectionPath);
            } catch {
                // Fallback ke defaultHandler.js jika file tidak ditemukan
                sectionHandler = require('./sections/weapons/defaultHandler.js');
            }
        }

        // Panggil handler dan dapatkan data
        const weaponData = await sectionHandler($, baseUrl, name);

        return weaponData;
    } catch (error) {
        throw new Error(`Error fetching data from ${baseUrl}: ${error.message}`);
    }
};

module.exports = { getWeaponData };
