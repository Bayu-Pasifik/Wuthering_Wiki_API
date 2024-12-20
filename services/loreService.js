// const axios = require('axios');
// const cheerio = require('cheerio');

// const getLoreData = async (name) => {
//     if (!name || typeof name !== 'string') {
//         throw new Error('Invalid "name" parameter. It must be a non-empty string.');
//     }

//     const baseUrl = `https://wutheringwaves.fandom.com/wiki/${name}`;
//     const sectionName = name.toLowerCase();
//     console.log(sectionName);

//     try {
//         const { data } = await axios.get(baseUrl);
//         const $ = cheerio.load(data);

//         // Dynamic import handler berdasarkan section
//         const sectionPath = `./sections/lore/${sectionName}.js`;
//         let sectionHandler;

//         try {
//             sectionHandler = require(sectionPath); // Coba impor file sesuai section
//         } catch {
//             sectionHandler = require('./sections/lore/index.js'); // Fallback ke index.js jika file tidak ditemukan
//         }

//         // Panggil handler dan dapatkan data
//         const loreData = await sectionHandler($, baseUrl, name);

//         return loreData;
//     } catch (error) {
//         throw new Error(`Error fetching data from ${baseUrl}: ${error.message}`);
//     }
// };

// module.exports = { getLoreData };

const axios = require('axios');
const cheerio = require('cheerio');

const getLoreData = async (name) => {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid "name" parameter. It must be a non-empty string.');
    }

    const baseUrl = `https://wutheringwaves.fandom.com/wiki/${name}`;
    const sectionName = name.toLowerCase();
    console.log(sectionName);

    try {
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);

        let sectionHandler;

        try {
            // Coba impor file sesuai section
            const sectionPath = `./sections/lore/${sectionName}.js`;
            sectionHandler = require(sectionPath);
        } catch {
            // Fallback ke defaultHandler.js jika file tidak ditemukan
            sectionHandler = require('./sections/lore/defaultHandler.js');
        }

        // Panggil handler dan dapatkan data
        const loreData = await sectionHandler($, baseUrl, name);

        return loreData;
    } catch (error) {
        throw new Error(`Error fetching data from ${baseUrl}: ${error.message}`);
    }
};

module.exports = { getLoreData };
