const { cleanText } = require("../../../utils/cleanText");
const { resizeImage } = require("../../../utils/resizeImage");

module.exports = ($, url, name) => {
    // Fungsi untuk menggabungkan beberapa paragraf
   

    const introduction = "The Sentinels, also called Oracle Engines, stand at the brink of civilization and history, as guardians and guides. Their immortal existence has helped humanity through countless troubles, sharing prophecies and wisdom. As we embark on a new journey after enduring the , the Sentinels remain our record keeper and beacon in times of disaster.";

    // Mengambil nama lokasi dari elemen dengan atribut data-source="title"
    const locationName = cleanText($('aside [data-source="title"]').text());

    // Mengambil data tipe lokasi dari elemen dengan atribut data-source="type"
    const locationType = cleanText($('aside [data-source="type"] .pi-data-value').text());

    // Mengambil semua gambar dari elemen <aside>
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
    const sentinelDescription = cleanText($('p').eq(2).text());
const knownSentinels = [];

// Proses tabel dengan indeks 0 dan 1 secara eksplisit
$('table.article-table:eq(0), table.article-table:eq(1)').each((tableIndex, table) => {
    $(table)
        .find('tbody tr')
        .each((index, row) => {
            if (index === 0) return; // Skip header row
            const columns = $(row).find('td');
            const images = $(columns[0]).find('a').attr('href');
            const name = cleanText($(columns[1]).text());
            const area = cleanText($(columns[2]).text());

            // Ambil connected_resonators
            const connectedResonators = [];
            $(columns[3])
                .find('li')
                .each((_, li) => {
                    const resonatorName = cleanText($(li).find('a').text());
                    const resonatorPosition = cleanText($(li).text().replace(`${resonatorName} - `, "").trim());
                    connectedResonators.push({
                        name: resonatorName,
                        position: resonatorPosition,
                    });
                });

            knownSentinels.push({
                name,
                area,
                images,
                description: tableIndex === 0 ? sentinelDescription || "" : "Unknown",
                connected_resonators: connectedResonators,
            });
        });
});

console.log(knownSentinels);


   
    // Mengambil other languages
    const otherLanguages = [];
    $('table.article-table:eq(2) tbody tr').each((index, element) => {
        if (index === 0) return; // Skip header
        const columns = $(element).find('td');
        const language = cleanText($(columns[0]).text());
        const name = cleanText($(columns[1]).text());
        otherLanguages.push({ language, name });
    });

    // Output hasil
    return {
        name: cleanText(name || locationName), // Nama diambil dari parameter atau fallback ke lokasi
        official_introduction: introduction, // Gabungan paragraf
        type: locationType || null, // Tipe lokasi
        images: images.length ? images : null, // Semua gambar dari <aside>
        sentinels: knownSentinels.length ? knownSentinels : null, // Tabel data (jika ada)
        other_languages: otherLanguages.length ? otherLanguages : null,
        source_url: url, // URL sumber data
    };
};
