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
        return paragraphs.slice(0, 4).join(' '); // Ambil maksimal 3 paragraf pertama
    };

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

    // Mengambil data dari tabel
    const tableData = [];
    $('table.wikitable tbody tr').each((index, row) => {
        if (index === 0) return; // Skip header row
        const columns = $(row).find('td');
        const nation = cleanText($(columns[0]).text());
        let sentinels = cleanText($(columns[1]).text());
        const capital = cleanText($(columns[2]).text());
        const headOfState = cleanText($(columns[3]).text());
        const governingBody = cleanText($(columns[4]).text());
        const nationImage = $(columns[0]).find('img').attr('data-src');

        // Memisahkan sentinels dengan tanda koma jika mereka dempet
        sentinels = sentinels.replace(/([a-zA-Z])([A-Z])/g, '$1, $2');

        tableData.push({
            nation,
            sentinels: sentinels || "Unknown",
            capital: capital || "Unknown",
            head_of_state: headOfState || "Unknown",
            governing_body: governingBody || "Unknown",
            nation_image: nationImage || null,
        });
    });

    // Mengambil data dari elemen galeri
    const galleryItems = [];
    $('#gallery-1 .wikia-gallery-item').each((_, item) => {
        const img = $(item).find('img');
        const title = cleanText($(item).find('.lightbox-caption').text());
        const imgUrl = resizeImage(img.attr('data-src'));
        const imgAlt = img.attr('alt');

        galleryItems.push({
            title: title || null,
            image_url: imgUrl || null,
            alt_text: imgAlt || null,
        });
    });

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
        official_introduction: getCombinedIntroduction(), // Gabungan paragraf
        type: locationType || null, // Tipe lokasi
        images: images.length ? images : null, // Semua gambar dari <aside>
        nations: tableData.length ? tableData : null, // Tabel data (jika ada)
        gallery: galleryItems.length ? galleryItems : null, // Data galeri (jika ada)
        other_languages: otherLanguages.length ? otherLanguages : null,
        source_url: url, // URL sumber data
    };
};
