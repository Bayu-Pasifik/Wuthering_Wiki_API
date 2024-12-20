const { cleanText } = require("../../../utils/cleanText");
const { resizeImage } = require("../../../utils/resizeImage");

module.exports = ($, url, name) => {
    // Fungsi untuk menggabungkan beberapa paragraf
    const getCombinedIntroduction = () => {
        const paragraphs = [];
        $('p').each((index, element) => {
            const text = cleanText($(element).text());
            if (text) {
                paragraphs.push(text);
            }
        });

        // Gabungkan semua paragraf yang relevan
        return paragraphs.slice(0, 3).join(' '); // Ambil maksimal 3 paragraf pertama
    };

    // Mengambil nama lokasi dari elemen dengan atribut data-source="title"
    const locationName = cleanText($('aside [data-source="title"]').text());

  
    // Mengambil other languages
    const otherLanguages = [];
    $('table.article-table tbody tr').each((index, element) => {
        if (index === 0) return; // Skip header
        const columns = $(element).find('td');
        const language = cleanText($(columns[0]).text());
        const name = cleanText($(columns[1]).text());
        otherLanguages.push({ language, name });
    });

    const Threnodians = [];
    $('table.article-table:eq(0) tbody tr').each((index, element) => {
        if (index === 0) return; // Skip header
        const columns = $(element).find('td');
        const image = resizeImage($(columns[0]).find('img').attr('src') || null);
        const name = cleanText($(columns[1]).text());
        const embodiment = cleanText($(columns[2]).text());
        const location = cleanText($(columns[3]).text());
        Threnodians.push({ image, name, embodiment, location });
    });
    // Output hasil
    return {
        name: cleanText(name || locationName), // Nama diambil dari parameter atau fallback ke lokasi
        official_introduction: getCombinedIntroduction(), // Gabungan paragraf
        known_threnodians: Threnodians.length ? Threnodians : null,
        other_languages: otherLanguages.length ? otherLanguages : null,
        source_url: url, // URL sumber data
    };
};
