const { cleanText } = require('../../../utils/cleanText');
const { resizeImage } = require('../../../utils/resizeImage');

module.exports = ($, url, name) => {
    const listResonators = [];

    [0, 1].forEach((tableIndex) => {
        $(`.article-table:eq(${tableIndex}) tbody tr`).each((index, element) => {
            if (index === 0) return; // Skip header
            const columns = $(element).find('td');

            // Icon dan Name
            const iconSrc = $(columns[0]).find('img').attr('data-src') || '';
            const icon = iconSrc ? resizeImage(iconSrc) : '';
            const name = cleanText($(columns[1]).text() || '');

            // Rarity
            const rarityIconSrc = $(columns[2]).find('img').attr('data-src') || '';
            const rarityTitle = cleanText($(columns[2]).find('img').attr('alt') || '').replace('Icon ', '');
            const rarity = {
                icon: rarityIconSrc ? resizeImage(rarityIconSrc) : '',
                title: rarityTitle,
            };

            const attribute = cleanText($(columns[3]).text() || '');

            const weapon = cleanText($(columns[4]).text() || '');

            const birthPlace = cleanText($(columns[5]).text() || '');

            const category = cleanText($(columns[6]).text() || '');

            const version = cleanText($(columns[7]).find('a').text() || '');
            const dateRaw = $(columns[7]).contents().filter((_, el) => el.nodeType === 3).text();
            const date = cleanText(dateRaw.replace(/[()]/g, '') || '');

            // Tambahkan ke list
            const release = { version, date };

            // Tambahkan ke list
            listResonators.push({ icon, name, rarity, attribute, weapon, birthPlace, class:category, release });
        });
    });

    return {
        resonators: listResonators
    };
};
