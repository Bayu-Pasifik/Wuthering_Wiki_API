const { cleanText } = require("../../../utils/cleanText");

module.exports = ($, url, name) => {
    // Helper function untuk membersihkan teks
    // const clean = (text) => cleanText(text || '').trim();

    // Mengambil <p> pertama (sementara static, karena spesifik request Anda)
    const getCombinedIntroduction = () => {
        const paragraphs = [];
        $('div.mw-parser-output > p').each((index, element) => {
            const text = cleanText($(element).text());
            if (text) {
                paragraphs.push(text);
            }
        });

        // Gabungkan semua paragraf yang relevan
        return paragraphs.slice(0, 3).join(' '); // Ambil maksimal 3 paragraf pertama
    };;

    // Array untuk menyimpan semua data lore
    const lore = [];

    // Cari semua elemen 'tr' dalam tabel utama
    $('table.navbox-subgroup > tbody > tr').each((_, tr) => {
        const typeElement = $(tr).find('th.navbox-group > a');
        const loreElements = $(tr).find('td.navbox-list ul li a');

        if (typeElement.length && loreElements.length) {
            // Ambil tipe (seperti 'General', 'Huanglong', dll.)
            const type = typeElement.text();

            // Ambil semua lore di bawah tipe tersebut
            const loreItems = loreElements.map((_, loreEl) => ({
                name: $(loreEl).text(),
                url: `${url}${$(loreEl).attr('href')}`,
            })).get();

            // Tambahkan data ke array lore
            lore.push({
                type,
                lore: loreItems,
            });
        }
    });

    // Output hasil
    return {
        success: true,
        name,
        official_introduction: getCombinedIntroduction(), // Gabungan paragraf,
        lore,
    };
};
