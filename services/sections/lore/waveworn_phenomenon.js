const { cleanText } = require("../../../utils/cleanText");
const { resizeImage } = require("../../../utils/resizeImage");
module.exports = ($, url, name) => {

    // Mengambil <p> pertama
    const introduction = cleanText($('p').eq(2).text());
    const image = resizeImage($('.pi-image img').attr('src'));
    const locationType = cleanText($('aside [data-source="type"] .pi-data-value').text());
    const otherLanguages = [];
    $('table.article-table tbody tr').each((index, element) => {
        if (index === 0) return;
        const columns = $(element).find('td');
        const language = cleanText($(columns[0]).text());
        const name = cleanText($(columns[1]).text());
        otherLanguages.push({language,name} );
    });
    // Output hasil
    return {
        name,
        official_introduction: introduction,
        type: locationType,
        images:{
            official: image
        },
        other_languages: otherLanguages
        
    };
};