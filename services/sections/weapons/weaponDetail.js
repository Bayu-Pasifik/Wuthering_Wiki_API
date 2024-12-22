const { cleanText } = require("../../../utils/cleanText");
const { resizeImage } = require("../../../utils/resizeImage");

module.exports = ($, url, name) => {
    // Ambil data judul dan deskripsi
    const title = cleanText($('h1.page-header__title').text());
    const description = cleanText($('div.description').first().text());
    const additionalDescription = cleanText($('p').eq(2).text());

    // Ambil gambar senjata
    let icon = {};
    $('aside figure.pi-image img').each((_, img) => {
        const src = resizeImage($(img).attr('src') || null);
        const alt = cleanText($(img).attr('alt') || null);
        icon = {
            url: src,
            alt_text: alt,
        };
    });

    // Ambil data rarity (kelangkaan senjata)
    const rarity = cleanText($('td[data-source="rarity"] img').attr('alt') || '');

    // Ambil tipe senjata
    const weaponType = cleanText($('td[data-source="type"]').text());

    // Ambil tipe statistik kedua
    const secondStatType = cleanText($('td[data-source="2nd_stat_type"]').text());

    // Ambil metode akuisisi
    const acquisitionMethod = cleanText($('div[data-source="acquire"] a').text());

    // Ambil tanggal rilis (menghapus "xxx ago")
    const releaseDate = $('div[data-source="released"] .pi-data-value').html()
        .split('<br>')[0] // Ambil bagian sebelum <br>
        .trim() || '';

    // Ambil efek berdasarkan rank (1-5) dan biaya upgrade
    const effectsRank = [];
    for (let rank = 1; rank <= 5; rank++) {
        let level = rank + 1;
        const effectDescription = cleanText($(`td[data-source="eff_rank${rank}_var1"]`).text());
        let upgradeFrom = cleanText($('div[data-source="eff_rank' + level + '_var1"]').find('h3.pi-data-label').text());
        let upgradeCost = cleanText($('div[data-source="eff_rank' + level + '_var1"]').find('div.pi-data-value').text());
        if (rank === 5) {
            upgradeFrom = "MAX";
            upgradeCost = "MAX";
        }
        if (effectDescription) {
            effectsRank.push({
                rank: rank,
                effect: effectDescription,
                upgrade_cost: {
                    from: upgradeFrom,
                    cost: upgradeCost,
                },
            });
        }
    }


    const ascensions = [];

    // Seleksi baris berdasarkan indeks ganjil atau genap
    const statsTable = $('table.ascension-stats tbody tr');

    let lastRanks = ""; // Menyimpan nilai ranks terakhir

statsTable.each((index, row) => {
    // Tentukan kelas yang akan digunakan untuk baris berdasarkan indeks
    const rowClass = index % 2 === 0 ? 'alternating2' : 'alternating1'; // genap = alternating2, ganjil = alternating1
    
    // Periksa apakah baris ini memiliki kelas yang sesuai
    if (!$(row).hasClass(rowClass)) {
        return; // Lewati jika baris tidak sesuai kelasnya
    }

    // Periksa apakah ada <td> dengan rowspan="2" di baris ini
    const ranksCell = $(row).find('td[rowspan="2"]');
    if (ranksCell.length > 0) {
        lastRanks = cleanText(ranksCell.text());
    }

    // Ambil kolom pertama untuk menentukan tipe data
    const levelOrCost = cleanText($(row).find('td:eq(1)').text());
    const baseAtt = cleanText($(row).find('td:eq(2)').text()); // Kolom 2
    const secondAttck = cleanText($(row).find('td:eq(3)').text()); // Kolom 3

    // Filter hanya data level (bukan Ascension Cost)
    if (!levelOrCost.startsWith('Ascension Cost')) {
        ascensions.push({
            rank: lastRanks,
            level: levelOrCost,
            base_attack: baseAtt,
            second_stat: secondAttck,
        });
    }
});


    

    // Struktur data akhir
    return {
        name,
        title,
        description,
        additional_description: additionalDescription,
        icon,
        rarity,
        weapon_type: weaponType,
        second_stat_type: secondStatType,
        acquisition_method: acquisitionMethod,
        release_date: releaseDate,
        effects_by_rank: effectsRank,
        ascensions, // Tambahkan ascensions ke data akhir
    };
};
