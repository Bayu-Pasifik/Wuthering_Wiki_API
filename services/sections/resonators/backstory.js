module.exports = ($, url, name) => {
    // Fungsi untuk membersihkan teks
    const cleanText = (text) => text
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || '';

    // Mengambil pengantar resmi
    const introduction = cleanText($('div.pull-quote__text').text()) || 
        cleanText($('div.description').text());

    // Mengambil kepribadian (jika ada)
    const personality = cleanText($('p').eq(1).text());

    // Mengambil informasi tabel untuk Evaluation dan Overclock
    const report = [];

    // Mengambil Evaluation dari baris pertama (eq(1))
    const evaluation = cleanText($('table.article-table').eq(1).find('tbody tr').eq(1).text());
    if (evaluation) {
        report.push({
            title: 'evaluation_report',
            content: evaluation
        });
    }

    // Mengambil Overclock dari baris ketiga (eq(3))
    const overclock = cleanText($('table.article-table').eq(1).find('tbody tr').eq(3).text());
    if (overclock) {
        report.push({
            title: 'overclock_report',
            content: overclock
        });
    }

    // Memproses tabel cerita
    const characterStories = [];
    const storyRows = $('table.article-table').eq(2).find('tbody tr');

    let currentStory = {}; // Objek sementara untuk setiap story
    storyRows.each((index, row) => {
        if ($(row).find('th').length > 0) {
            if (currentStory.title || currentStory.story) {
                characterStories.push(currentStory); // Simpan cerita sebelumnya
            }
            currentStory = {
                title: cleanText($(row).find('th').eq(0).text()),
                unlock_at: cleanText($(row).find('th').eq(1).text())
            };
        } else if ($(row).find('td').length > 0) {
            currentStory.story = cleanText($(row).find('td').text());
        }
    });

    if (currentStory.title || currentStory.story) {
        characterStories.push(currentStory); // Tambahkan cerita terakhir
    }

    // Memproses cherished items
    const characterItems = [];
    const itemRows = $('table.article-table').eq(3).find('tbody tr');
    let currentItem = {}; // Objek sementara untuk setiap item

    itemRows.each((index, row) => {
        if ($(row).find('th').length > 0) {
            if (currentItem.title || currentItem.description) {
                characterItems.push(currentItem); // Simpan item sebelumnya
            }
            currentItem = {
                title: cleanText($(row).find('th').eq(0).text()),
                unlock_at: cleanText($(row).find('th').eq(1).text())
            };
        } else if ($(row).find('td').length > 0) {
            // Memasukkan deskripsi dan gambar item
            currentItem.description = cleanText($(row).find('td').text());
            currentItem.image = $(row).find('img').attr('data-src') || ''; // Mengambil URL gambar
        }
    });

    if (currentItem.title || currentItem.description) {
        characterItems.push(currentItem); // Tambahkan item terakhir
    }

    return {
        source: url,
        name,
        official_introduction: introduction,
        personality: personality,
        report: report, 
        character_stories: characterStories,
        cherised_items: characterItems
    };
};
