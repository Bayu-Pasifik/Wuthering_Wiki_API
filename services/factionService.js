const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi utama untuk mendapatkan data faction
const getFactionData = async (name) => {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid "name" parameter. It must be a non-empty string.');
    }
    // Tentukan URL berdasarkan `name`
    const baseUrlName = name === 'factions' ? 'Factions' : name;
    const baseUrl = `https://wutheringwaves.fandom.com/wiki/${baseUrlName}`;
    const sectionName = name.toLowerCase();

    try {
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);

        let sectionHandler;

        // Tentukan handler secara dinamis
        if (sectionName === 'factions') {
            sectionHandler = require('./sections/factions/index.js');
        } else {
            sectionHandler = require('./sections/factions/factionDetail.js');
        }

        // Panggil handler dan dapatkan data
        const factionData = await sectionHandler($, baseUrl, name);

        return factionData;
    } catch (error) {
        throw new Error(`Error fetching data from ${baseUrl}: ${error.message}`);
    }
};

module.exports = { getFactionData };
