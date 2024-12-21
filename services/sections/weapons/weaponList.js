const { cleanText } = require('../../../utils/cleanText');
const { resizeImage } = require('../../../utils/resizeImage');
module.exports = ($, url, name) => {
    const paragraphs = $('div.mw-parser-output > p').map((index, element) => cleanText($(element).text())).get().slice(0, 3).join(' ');
    const weapons = [];
    let rarity = {};
    $('table.article-table:eq(0) tbody tr').each((index, element) => {
        if (index === 0) return; // Skip header row
        const columns = $(element).find('td');
        const icon = resizeImage($(columns[0]).find('img').attr('data-src'));
        const name = cleanText($(columns[1]).text());
        const rarityImages = resizeImage($(columns[2]).find('a img').attr('data-src'));
        const rarityText = cleanText($(columns[2]).find('a img').attr('alt').replace('Icon ', ''));
        rarity = { images:rarityImages, title: rarityText };
        const type = cleanText($(columns[3]).text());
        const secondStats = cleanText($(columns[4]).text());
        const acquisitionMethod = cleanText($(columns[5]).text());
        weapons.push({ icon, name, rarity, type,
         second_stats: secondStats, acquisition_method: acquisitionMethod });
    });
    return {
        introduction:paragraphs,
        weapons
        
    }
}