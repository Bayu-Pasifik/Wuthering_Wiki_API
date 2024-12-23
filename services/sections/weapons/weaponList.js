const { cleanText } = require('../../../utils/cleanText');
const { resizeImage } = require('../../../utils/resizeImage');

module.exports = ($, url, name) => {
    const paragraphs = $('div.mw-parser-output > p')
        .map((index, element) => cleanText($(element).text()))
        .get()
        .slice(0, 3)
        .join(' ');

    const weapons = [];
    let rarity = {};
    $('table.article-table:eq(0) tbody tr').each((index, element) => {
        if (index === 0) return; // Skip header row
        const columns = $(element).find('td');

        // Ambil data gambar dan cek jika null
        const icon = resizeImage($(columns[0]).find('img').attr('data-src'));
        const name = cleanText($(columns[1]).text());

        // Ambil data rarity
        const rarityImageElement = $(columns[2]).find('a img');
        const rarityImages = resizeImage(rarityImageElement.attr('data-src') || '');
        const rarityText = rarityImageElement.attr('alt')
            ? cleanText(rarityImageElement.attr('alt').replace('Icon ', ''))
            : '';

        rarity = { images: rarityImages, title: rarityText };

        // Ambil tipe, statistik kedua, dan metode akuisisi
        const type = cleanText($(columns[3]).text());
        const secondStats = cleanText($(columns[4]).text());
        const acquisitionMethod = cleanText($(columns[5]).text());

        weapons.push({
            icon,
            name,
            rarity,
            type,
            second_stats: secondStats,
            acquisition_method: acquisitionMethod,
        });
    });

    console.log(weapons);
    return {
        introduction: paragraphs,
        weapons,
    };
};
