const { cleanText } = require("../../utils/cleanText");

module.exports = async ($, url, name) => {
    try {
        const generalVoice = [];
        const tableGeneral = $('table.wikitable').eq(0).find('tbody tr');

        let currentGeneralVoice = null; // Inisialisasi sebagai null

        tableGeneral.each((index, row) => {
            if (index === 0) return; // Lewati header tabel

            const hasTitle = $(row).find('th.hidden').length > 0;
            const hasStory = $(row).find('td').length > 0;

            if (hasTitle) {
                // Simpan objek sebelumnya jika ada
                if (currentGeneralVoice) {
                    generalVoice.push(currentGeneralVoice);
                }

                // Ambil title dan requirement dari elemen <th>
                const title = cleanText($(row).find('th.hidden span[lang="en"]').text()) || '';
                const requirement = cleanText($(row).find('th div small i').text()) || '';

                // Inisialisasi objek baru untuk cerita ini
                currentGeneralVoice = {
                    title,
                    requirement,
                    detail: '', // Akan diperbarui jika ditemukan dalam <td>
                    audio: '', // Akan diperbarui jika ditemukan dalam <td>
                };
            }

            if (hasStory && currentGeneralVoice) {
                // Ambil detail dari elemen <td>
                const detail = cleanText($(row).find('td span[lang="en"]').text()) || '';
                currentGeneralVoice.detail = detail;

                // Seleksi elemen <span> dengan kelas `audio-button`
                const audioSpan = $(row).find('td span.audio-button');
                if (audioSpan.is('no-audio')) {
                    // Jika elemen memiliki kelas `no-audio`, set audio ke ""
                    currentGeneralVoice.audio = '';
                } else {
                    // Jika tidak ada kelas `no-audio`, ambil href audio
                    const audio = audioSpan.find('a').attr('href') || '';
                    currentGeneralVoice.audio = audio;
                }
            }
        });

        // Tambahkan objek terakhir jika ada
        if (currentGeneralVoice) {
            generalVoice.push(currentGeneralVoice);
        }

        // Return hasil
        return {
            url,
            name,
            generalVoiceLanes: generalVoice,
        };
    } catch (error) {
        console.error(`Error extracting data: ${error.message}`);
        return {
            url,
            name,
            generalVoiceLanes: [],
            error: error.message,
        };
    }
};
