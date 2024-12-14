const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi untuk mendapatkan data resonator
const getResonatorData = async (name, section) => {
    const baseUrl = `https://wutheringwaves.fandom.com/wiki/${name}`;
    const url = section ? `${baseUrl}/${section}` : baseUrl;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Dynamic import handler berdasarkan section
        const sectionHandler = require(`./sections/${section || 'default'}.js`);

        // Panggil handler dan dapatkan data
        const resonatorData = await sectionHandler($, url, name);

        return resonatorData;
    } catch (error) {
        throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
};

module.exports = { getResonatorData };
