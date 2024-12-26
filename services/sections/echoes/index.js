const {cleanText} = require('../../../utils/cleanText');
const {resizeImage} = require('../../../utils/resizeImage');
module.exports =($, url, name) => {
    const introduction = $('div.mw-parser-output > p').map((index, element) => cleanText($(element).text())).get().slice(0, 5).join('');
    const otherLanguages = [];
    $('table.article-table tbody tr').each((index, element) => {
        if (index === 0) return; // Skip header
        const columns = $(element).find('td');
        const language = cleanText($(columns[0]).text());
        const name = cleanText($(columns[1]).text());
        otherLanguages.push({ language, name });
    });
    const sideInfo = $('aside.portable-infobox');
    const title = sideInfo.find('h2').text().trim();
    const icon = resizeImage(sideInfo.find('img').attr('src'));
    return {
        title: title,
        icon: icon,
        introduction: introduction,
        other_languages: otherLanguages
    };
}