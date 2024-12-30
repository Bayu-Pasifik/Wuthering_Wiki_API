const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi untuk mendapatkan data resonator
const getResonatorData = async (name, section) => {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid "name" parameter. It must be a non-empty string.');
    }

    // Perbaiki case "gallery" -> "Gallery" untuk URL
    const baseUrlName = name === 'list' ? 'Resonator' : name;
    const baseUrl = `https://wutheringwaves.fandom.com/wiki/${baseUrlName}`;
    const url = section ? `${baseUrl}/${section.charAt(0).toUpperCase() + section.slice(1)}` : baseUrl;

    // Pastikan section lowercase sebelum digunakan
    if (section) {
        section = section.toLowerCase(); // Menggunakan toLowerCase dengan "C" besar
    }
    console.log("Section:", section);
    console.log("URL:", url);
    console.log("Name:", name);

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let sectionHandler;

        // Tentukan handler berdasarkan section
        if (name === 'list') {
            sectionHandler = require('./sections/resonators/list.js');
        } else if(section === 'voicelines') {
            sectionHandler = require('./sections/resonators/voicelines.js');
        }
        else {
            sectionHandler = require(`./sections/resonators/${section || 'default'}.js`);
        }

        // Panggil handler dan dapatkan data
        const resonatorData = await sectionHandler($, url, name);

        return resonatorData;
    } catch (error) {
        throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
};

module.exports = { getResonatorData };
