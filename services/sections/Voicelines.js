const { cleanText } = require("../../utils/cleanText");

module.exports = async ($, url, name) => {
    try {
        const generalVoice = [];
        const tableGeneral = $('table.wikitable').eq(0).find('tbody tr');

        let currentGeneralVoice = {}; // Objek sementara untuk setiap cerita

        tableGeneral.each((index, row) => {
            if (index === 0) return; // Lewati header tabel

            const hasTitle = $(row).find('th.hidden').length > 0; 
            const hasStory = $(row).find('td').length > 0;

            if (hasTitle) {

                // Ambil title dan requirement dari elemen <th>
                const title = cleanText($(row).find('th.hidden span[lang="en"]').text());
                const requirement = cleanText($(row).find('th div small i').text());
                const detail = cleanText($(row).find('td span[lang="en"]').text());

                currentGeneralVoice = {
                    title,
                    requirement,
                    detail
                };
            }
            generalVoice.push(currentGeneralVoice);
        });

        // Return hasil
        return {
            url,
            name,
            generalVoiceLanes: generalVoice,
        };
    } catch (error) {
        console.error(`Error extracting data: ${error.message}`);
        return {
            url,
            name,
            generalVoiceLanes: [],
            error: error.message,
        };
    }
};
