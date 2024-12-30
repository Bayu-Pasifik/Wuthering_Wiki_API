const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi untuk mendapatkan data resonator
const getResonatorData = async (name, section) => {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid "name" parameter. It must be a non-empty string.');
    }
    const baseUrlName = name === 'list' ? 'Resonator' : name;
    const baseUrl = `https://wutheringwaves.fandom.com/wiki/${baseUrlName}`;
    const url = section ? `${baseUrl}/${section}` : baseUrl;
    section = section.toLowerCase();
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        let sectionHandler;
        if(name === 'list') {
            sectionHandler = require('./sections/resonators/list.js');
        } else{

            sectionHandler = require(`./sections/resonators/${section || 'default'}.js`);
        }
        // Dynamic import handler berdasarkan section
        // Panggil handler dan dapatkan data
        const resonatorData = await sectionHandler($, url, name);

        return resonatorData;
    } catch (error) {
        throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
};

module.exports = { getResonatorData };
