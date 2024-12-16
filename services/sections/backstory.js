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
        // Jika menemukan elemen <th>, berarti itu bagian judul dan informasi unlock
        if ($(row).find('th').length > 0) {
            if (currentStory.title || currentStory.story) {
                // Tambahkan cerita sebelumnya jika sudah ada data
                characterStories.push(currentStory);
            }
            // Reset currentStory dan isi dengan data baru
            currentStory = {
                title: cleanText($(row).find('th').eq(0).text()),
                unlock_at: cleanText($(row).find('th').eq(1).text())
            };
        } else if ($(row).find('td').length > 0) {
            // Jika menemukan elemen <td>, itu adalah konten cerita
            currentStory.story = cleanText($(row).find('td').text());
        }
    });

    // Menambahkan cerita terakhir ke dalam array
    if (currentStory.title || currentStory.story) {
        characterStories.push(currentStory);
    }

    return {
        source: url,
        name,
        official_introduction: introduction,
        personality: personality,
        report: report,  // Menyimpan laporan dalam bentuk array objek
        character_stories: characterStories // Menyimpan cerita dalam format { title, unlock_at, story }
    };
};
