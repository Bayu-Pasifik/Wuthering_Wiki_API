module.exports = ($, url, name) => {
    // Ambil data atribut dan senjata
    const attributeName = $('td[data-source="attribute"] a[title]').text().trim() || '';
    const attributeIcon = $('td[data-source="attribute"] img').attr('data-src') || '';
    const weaponName = $('td[data-source="weapon"] a[title]').text().trim() || '';
    const weaponIcon = $('td[data-source="weapon"] img').attr('data-src') || '';
    const rarityElement = $('td[data-source="rarity"]');
   // Untuk rarityName
    const rarityName = rarityElement.find('a').attr('title') ? 
    rarityElement.find('a').attr('title').replace("Category:", "") : '';
    const rarityIcon = rarityElement.find('a img').attr('src') || '';
    console.log(rarityIcon);
    const finalRarityIcon = rarityName === '4-Star Resonators' ? rarityIcon : "https://static.wikia.nocookie.net/wutheringwaves/images/2/2b/Icon_5_Stars.png/revision/latest/scale-to-width-down/1000000?cb=20240429134545";
    const roleElement = $('div[data-source="role"]');
    const roles = roleElement.find('ul li a').map((_, element) => {
        return $(element).text().trim();
    }).get();

    // Ambil data introduction hanya yang ada di Official Website
    const introductionInfo = $('blockquote.pull-quote').filter((_, blockquote) => {
        const citeLink = $(blockquote).find('.pull-quote__source cite a').attr('href');
        return citeLink && citeLink.includes('wutheringwaves.kurogames.com/en/main#resonators');
    }).find('.pull-quote__text p').text().trim().replace(/\n/g, ' ') || '';  // Menambahkan fallback string kosong jika tidak ada teks

    // Untuk quotes blockquote
    const quotes = $('blockquote.pull-quote').not((_, blockquote) => {
        const citeLink = $(blockquote).find('.pull-quote__source cite a').attr('href');
        return citeLink && citeLink.includes('wutheringwaves.kurogames.com/en/main#resonators');
    }).map((_, blockquote) => {
        const text = $(blockquote).find('.pull-quote__text p').text().trim();
        return text ? text.replace(/\n/g, ' ') : '';
    }).get().join(' ');

    // Perbaikan untuk releaseDate
    const releaseElement = $('div[data-source="releaseDate"] .pi-data-value').html();
    const releaseDate = releaseElement ? releaseElement.split('<br>')[0].trim() : '';

    // Ambil data tambahan yang telah dicrawling sebelumnya
    const characterData = {
        class: $('div[data-source="class"] .pi-data-value').text().trim() || '',
        gender: $('div[data-source="gender"] .pi-data-value').text().trim() || '',
        birthday: $('div[data-source="birthday"] .pi-data-value').text().trim() || '',
        birthplace: $('div[data-source="birthplace"] .pi-data-value').text().trim() || '',
        affiliation: $('div[data-source="affiliation"] .pi-data-value').text().trim() || '',
        sigil: $('td[data-source="sigil"] .card-text').text().trim() || '',
        specialDish: $('td[data-source="dish"] .card-text').text().trim() || '',
        releaseDate: releaseElement ? releaseElement.split('<br>')[0].trim() : ''
    };

    // Ambil data skills
    const skills = [];
    $('.navbox-list .navbox-even, .navbox-list .navbox-odd').each((_, item) => {
        const category = $(item).find('small a').text().trim() || 'Unknown';
        const skillName = $(item).find('.wuwa-iconwcaption a').text().trim() || 'Unknown';
        const skillImage = $(item).find('.wuwa-iconwcaption-img img').attr('data-src') || '';
        const skillLink = $(item).find('.wuwa-iconwcaption a').attr('href') || '';

        skills.push({
            category,
            skillName,
            skillImage,
            skillLink
        });
    });

    // Ambil data voice actors
    // Perbaikan untuk voice actors pada bagian Japanese name yang menggunakan split
    const japaneseVoiceName = $('div[data-source="voiceJP"] .pi-data-value').text().trim();
    const japanese = {
        language: 'Japanese',
        name: japaneseVoiceName ? japaneseVoiceName.split('(')[0].replace(/\[\d+\]/g, '').trim() : '',
        kanji_name: $('div[data-source="voiceJP"] .pi-data-value span[lang="ja"]').text().trim() || ''
    };
    const voiceActors = {
        english: {
            language: 'English',
            name: $('div[data-source="voiceEN"] .pi-data-value a').text().trim() ? 
                $('div[data-source="voiceEN"] .pi-data-value a').text().trim().replace(/\[\d+\]/g, '') : '',
            kanji_name: ''
        },
        chinese: {
            language: 'Chinese',
            name: $('div[data-source="voiceCN"] .pi-data-value a').text().trim() ? 
                $('div[data-source="voiceCN"] .pi-data-value a').text().trim().replace(/\[\d+\]/g, '') : '',
            kanji_name: $('div[data-source="voiceCN"] .pi-data-value span[lang="zh"]').text().trim() || ''
        },
        japanese: japanese,
        korean: {
            language: 'Korean',
            name: $('div[data-source="voiceKR"] .pi-data-value a').text().trim() ? 
                $('div[data-source="voiceKR"] .pi-data-value a').text().trim().replace(/\[\d+\]/g, '').replace(/（.*）/g, '') : '',
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

    // Untuk officialName
const officialName = [];
$('table.alternating-colors-table tbody tr').each((index, row) => {
    if (index === 0) return;
    const countryText = $(row).find('td').eq(0).text().trim();
    const nameText = $(row).find('td').eq(1).text().trim();
    
    const country = countryText ? countryText.replace(/\s+/g, ' ') : '';
    const name = nameText ? nameText.replace(/\s+/g, ' ') : '';

    if (country && name) {
        officialName.push({
            country,
            name
        });
    }
});

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
        quotes: quotes,  // Menggunakan string untuk quotes
        introduction: introductionInfo,  // Memastikan introduction ada
        release_Date: characterData.releaseDate,
        sigil: characterData.sigil,
        specialDish: characterData.specialDish,
        voice_Actors: voiceActors,
        images: images,
        skills: skills,
        officialName: officialName, // Tambahkan officialName ke hasil akhir
    };
};
