const { cleanText } = require("../../../utils/cleanText");
const { resizeImage } = require("../../../utils/resizeImage");

module.exports = ($, url, name) => {
    // Ambil paragraf pertama sebagai introduction
    const introduction = $('div.mw-parser-output > p')
        .map((index, element) => cleanText($(element).text()))
        .get().slice(0, 3).join('');

    // Ambil data gambar
    const images = [];
    $('aside figure.pi-image img').each((_, img) => {
        const src = resizeImage($(img).attr('src') || null);
        const alt = cleanText($(img).attr('alt') || null);
        if (src) {
            images.push({
                url: src,
                alt_text: alt,
            });
        }
    });

    // Ambil data trofi
    const thropy_intro = $('p:eq(3)').text().trim();
    const trophies = {
        introduction: thropy_intro,
        items: []
    };

    $('table.article-table:eq(0) tbody tr').each((index, row) => {
        if (index === 0) return; // Skip header row
        const columns = $(row).find('td');
        const trophy = cleanText($(columns[0]).text().trim());
        const description = cleanText($(columns[1]).text().trim());
        const requirements = cleanText($(columns[2]).text().trim());
        const reward = cleanText($(columns[3]).text().trim());

        trophies.items.push({
            trophy,
            description,
            requirements,
            reward
        });
    });

    // Ambil data bahasa lain
    const otherLanguages = [];
    $('table.article-table:eq(1) tbody tr').each((index, element) => {
        if (index === 0) return; // Skip header row
        const columns = $(element).find('td');
        const language = cleanText($(columns[0]).text());
        const name = cleanText($(columns[1]).text());
        otherLanguages.push({ language, name });
    });

    // Struktur data akhir
    return {
        introduction,
        images,
        trophies,
        other_languages: otherLanguages
    };
};
