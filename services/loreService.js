const axios = require('axios');
const cheerio = require('cheerio');

const getLoreData = async (name) => {
    const baseUrl = `https://wutheringwaves.fandom.com/wiki/${name}`;

    try {
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);

        // Dynamic import handler berdasarkan section
        const sectionHandler = require(`./sections/lore/${name || './sections/lore/index'}.js`);

        // Panggil handler dan dapatkan data
        const loreData = await sectionHandler($, url, name);

        return loreData;
    } catch (error) {
        throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
};

module.exports = { getLoreData };
