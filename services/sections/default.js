module.exports = ($, url, name) => {
    // Ambil data atribut dan senjata
    const attributeName = $('td[data-source="attribute"] a[title]').text().trim() || '';
    const attributeIcon = $('td[data-source="attribute"] img').attr('data-src') || '';
    const weaponName = $('td[data-source="weapon"] a[title]').text().trim() || '';
    const weaponIcon = $('td[data-source="weapon"] img').attr('data-src') || '';
    const rarityElement = $('td[data-source="rarity"]');
    const rarityName = rarityElement.find('a').attr('title').replace("Category:", "") || '';
   // Ambil elemen gambar yang ada di dalam elemen <a> pada elemen rarity
    const rarityIcon = rarityElement.find('a img').attr('src') || ''; // Mencari <img> di dalam <a>
    const finalRarityIcon = rarityIcon && rarityIcon.startsWith('data:image') ? '' : rarityIcon; // Cek apakah itu data URI, jika iya kosongkan
    console.log(rarityIcon)
    const roleElement = $('div[data-source="role"]');
    const roles = roleElement.find('ul li a').map((_, element) => {
        return $(element).text().trim();
    }).get(); 

    // Ambil data tambahan yang telah dicrawling sebelumnya
    const characterData = {
        class: $('div[data-source="class"] .pi-data-value').text().trim() || '',
        gender: $('div[data-source="gender"] .pi-data-value').text().trim() || '',
        birthday: $('div[data-source="birthday"] .pi-data-value').text().trim() || '',
        birthplace: $('div[data-source="birthplace"] .pi-data-value').text().trim() || '',
        affiliation: $('div[data-source="affiliation"] .pi-data-value').text().trim() || '',
        sigil: $('td[data-source="sigil"] .card-text').text().trim() || '',
        specialDish: $('td[data-source="dish"] .card-text').text().trim() || '',
        releaseDate: $('div[data-source="releaseDate"] .pi-data-value').text().split('<br>')[0] // Mengambil bagian tanggal
            .replace(/\s*(\d+\s*(month|year)s?\s*ago)\s*/i, '').trim() || ''
    };

    // Ambil data voice actors
    const voiceActors = {
        english: {
            language: 'English',
            name: $('div[data-source="voiceEN"] .pi-data-value a').text().trim().replace(/\[\d+\]/g, '') || '',  // Menghapus angka referensi
            kanji_name: ''
        },
        chinese: {
            language: 'Chinese',
            name: $('div[data-source="voiceCN"] .pi-data-value a').text().trim().replace(/\[\d+\]/g, '') || '',  // Menghapus angka referensi
            kanji_name: $('div[data-source="voiceCN"] .pi-data-value span[lang="zh"]').text().trim() || ''
        },
        japanese: {
            language: 'Japanese',
            name: $('div[data-source="voiceJP"] .pi-data-value').text().trim().split('(')[0].replace(/\[\d+\]/g, '') || '', // Menghapus angka referensi
            kanji_name: $('div[data-source="voiceJP"] .pi-data-value span[lang="ja"]').text().trim() || ''
        },
        korean: {
            language: 'Korean',
            name: $('div[data-source="voiceKR"] .pi-data-value a').text().trim().replace(/\[\d+\]/g, '').replace(/（.*）/g, '') || '',  // Menghapus angka referensi dan karakter dalam tanda kurung
            kanji_name: $('div[data-source="voiceKR"] .pi-data-value span[lang="ko"]').text().trim() || ''
        }
    };

    // Ambil data images
    const images = $('div[data-source="image"] .wds-tab__content').map((_, content) => {
        const name = $(content).find('figure.pi-item img').attr('alt') || '';
        const url = $(content).find('figure.pi-item a').attr('href') || '';
        return {
            name,
            url
        };
    }).get();

    return {
        name,
        nickname: $('h2.pi-item[data-item-name="secondary_title"]').text().trim() || '',
        attribute: {
            name: attributeName,
            icon: attributeIcon,
        },
        weapon: {
            name: weaponName,
            icon: weaponIcon,
        },
        rarity: {
            name: rarityName,
            icon: finalRarityIcon,
        },
        roles: roles,
        class: characterData.class,
        gender: characterData.gender,
        birthdate: characterData.birthday,
        birthPlace: characterData.birthplace,
        affiliation: characterData.affiliation,
        quotes: $('div.pull-quote__text p').text().trim().replace(/\n/g, ' ') || '',
        release_Date: characterData.releaseDate,
        sigil: characterData.sigil,
        specialDish: characterData.specialDish,
        voice_Actors: voiceActors,
        images: images,
        source: url,
    };
};
