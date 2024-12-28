const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi utama untuk mendapatkan data faction
const getEchoesData = async (name) => {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid "name" parameter. It must be a non-empty string.');
    }
    // Tentukan URL berdasarkan `name`
    const baseUrlName = name === 'index' ? 'Echoes' : name === "stats" ? "Echoes/Stats": name === "leveling" ? "Echoes/Leveling": name ==="list" ? "Echoes/List" : name;
    const baseUrl = `https://wutheringwaves.fandom.com/wiki/${baseUrlName}`;
    const sectionName = name.toLowerCase();
    console.log(baseUrl)

    try {
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);

        let sectionHandler;

        // Tentukan handler secara dinamis
        if (sectionName === 'index') {
            sectionHandler = require('./sections/echoes/index.js');
        } 
        else if(sectionName === 'stats') {
            sectionHandler = require('./sections/echoes/stats.js');
        } else if(sectionName === 'leveling') {
            sectionHandler = require('./sections/echoes/leveling.js');
        } else if(sectionName === 'list') {
            sectionHandler = require('./sections/echoes/list.js');
        }

        // Panggil handler dan dapatkan data
        const echoesData = await sectionHandler($, baseUrl, name);

        return echoesData;
    } catch (error) {
        throw new Error(`Error fetching data from ${baseUrl}: ${error.message}`);
    }
};

module.exports = { getEchoesData };
