const { cleanText } = require('../../../utils/cleanText');
const { resizeImage } = require('../../../utils/resizeImage');
module.exports = ($, url, name) => {
    const listEchoes = [];
    
    $('table.fandom-table tbody tr').each((index, element) => {
        if (index === 0) return; // Skip header
        const columns = $(element).find('td');

        // Mendapatkan nama
        const name = cleanText($(columns[1]).find('span.item-text').text());

        // Mendapatkan ikon
        const icon = resizeImage($(columns[1]).find('img').attr('data-src'));

        // Mendapatkan cost sebagai integer
        const cost = parseInt(cleanText($(columns[2]).text()), 10);

        // Mendapatkan sonata sebagai array of object
        const sonataIcons = $(columns[3]).find('a img');
        const sonata = [];
        sonataIcons.each((_, img) => {
            const sonataIcon = $(img).attr('data-src');
            const sonataTitle = $(img).closest('a').attr('title');
            sonata.push({
                icon: resizeImage(sonataIcon),
                title: sonataTitle || "",
            });
        });

        // Mendapatkan kategori
        const category = cleanText($(columns[4]).text());

        // Menambahkan objek ke listEchoes
        listEchoes.push({ name, icon, cost, sonata, category });
    });

    return {
        echoes: listEchoes,
    };
};
