const { cleanText } = require("../../../utils/cleanText");
const { resizeImage } = require("../../../utils/resizeImage");

module.exports = ($, url, name) => {
    // Mengambil nama lokasi dari elemen dengan atribut data-source="title"
    const locationName = cleanText($('aside [data-source="title"]').text());

    // Mengambil data tipe lokasi dari elemen dengan atribut data-source="type"
    const locationType = cleanText($('aside [data-source="type"] .pi-data-value').text());

    // Mengambil data world map
    const worldMap = cleanText($('aside [data-source="map"] .pi-data-value').text());

    // Mengambil URL gambar pertama ("From Space")
    const imageFromSpace = $('aside .wds-tab__content.wds-is-current figure.pi-image img').attr('src');

    // Mengambil URL gambar kedua ("Map") jika ada
    const imageMap = $('aside .wds-tab__content:not(.wds-is-current) figure.pi-image img').attr('src');

    // Mengambil pengantar resmi dari elemen <p> pertama
    const introduction = cleanText($('p:first').text());

    // Mengambil data dari tabel
    const tableData = [];
    $('table.wikitable tbody tr').each((index, row) => {
        // Skip header row
        if (index === 0) return;

        const columns = $(row).find('td');
        const nation = cleanText($(columns[0]).text());
        let sentinels = cleanText($(columns[1]).text());
        const capital = cleanText($(columns[2]).text());
        const headOfState = cleanText($(columns[3]).text());
        const governingBody = cleanText($(columns[4]).text());

        // URL gambar nation (jika ada)
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

    // Mengambil data dari elemen <p> ke 3
    const history = $('p').eq(3).text().trim();

    //  Mengambil other languages
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
        name: cleanText(name || locationName), // Nama diambil dari parameter atau fallback ke lokasi
        official_introduction: introduction || null, // Jika ada pengantar resmi
        type: locationType || null, // Tipe lokasi
        world_map: worldMap || null, // Peta dunia
        images: {
            official: imageFromSpace || null,
            map: imageMap || null,
        },
        nations: tableData,
        history: history || null,
        gallery: galleryItems, // Data galeri
        other_languages: otherLanguages,
        source_url: url, // URL sumber data
    };
};
