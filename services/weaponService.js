const axios = require('axios');
const cheerio = require('cheerio');

const getWeaponData = async (name) => {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid "name" parameter. It must be a non-empty string.');
    }

    // Tentukan URL berdasarkan `name`
    const baseUrlName = name === 'index' ? 'weapons' : name === 'list' ? 'Weapons/List' : name;
    const baseUrl = `https://wutheringwaves.fandom.com/wiki/${baseUrlName}`;
    const sectionName = name.toLowerCase();

    try {
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);

        let sectionHandler;

        // Explicitly check for different sections and import the correct handler
        if (sectionName === 'index') {
            sectionHandler = require('./sections/weapons/index.js');
        } else if (sectionName === 'list') {
            sectionHandler = require('./sections/weapons/weaponList.js');
        } else {
            sectionHandler = require('./sections/weapons/weaponDetail.js');
        }

        // Panggil handler dan dapatkan data
        const weaponData = await sectionHandler($, baseUrl, name);

        return weaponData;
    } catch (error) {
        throw new Error(`Error fetching data from ${baseUrl}: ${error.message}`);
    }
};

module.exports = { getWeaponData };

