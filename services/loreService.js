const axios = require('axios');
const cheerio = require('cheerio');

const getLoreData = async (name, section) => {
    const baseUrl = `https://wutheringwaves.fandom.com/wiki/${name}`;
    const url = section ? `${baseUrl}/${section}` : baseUrl;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Dynamic import handler berdasarkan section
        const sectionHandler = require(`./sections/${section || 'default'}.js`);

        // Panggil handler dan dapatkan data
        const loreData = await sectionHandler($, url, name);

        return loreData;
    } catch (error) {
        throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
};

module.exports = { getLoreData };
