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
                if (currentGeneralVoice) {
                    generalVoice.push(currentGeneralVoice);
                }

                const title = cleanText($(row).find('th.hidden span[lang="en"]').text()) || '';
                const requirement = cleanText($(row).find('th div small i').text()) || '';

                currentGeneralVoice = {
                    title,
                    requirement,
                    detail: '',
                    audio: '',
                };
            }

            if (hasStory && currentGeneralVoice) {
                const detail = cleanText($(row).find('td span[lang="en"]').text()) || '';
                currentGeneralVoice.detail = detail;

                const audioSpan = $(row).find('td span.audio-button');
                const audio = audioSpan.find('a').attr('href') || '';
                currentGeneralVoice.audio = audioSpan.is('no-audio') ? '' : audio;
            }
        });

        if (currentGeneralVoice) {
            generalVoice.push(currentGeneralVoice);
        }

        const combatVoice = [];
        const tableCombat = $('table.wikitable').eq(1).find('tbody tr');

        let currentCombatVoice = null;

        tableCombat.each((index, row) => {
            if (index === 0) return;

            const mobile = $(row).find('.mobile-only');
            if (mobile.length === 0) return;

            const hasTitle = $(row).find('th').length > 0;
            const hasStory = $(row).find('td').length > 0;

            if (hasTitle) {
                if (currentCombatVoice) {
                    combatVoice.push(currentCombatVoice);
                }

                const title = cleanText($(row).find('th.hidden span[lang="en"]').text()) || '';
                currentCombatVoice = {
                    title,
                    details: [],
                };
            }

            if (hasStory && currentCombatVoice) {
                const text = cleanText($(row).find('td span[lang="en"]').text()) || '';
                const audioSpan = $(row).find('td span.audio-button');
                const audio = audioSpan.find('a').attr('href') || '';

                currentCombatVoice.details.push({
                    text,
                    audio: audioSpan.is('no-audio') ? '' : audio,
                });
            }
        });

        if (currentCombatVoice) {
            combatVoice.push(currentCombatVoice);
        }

        return {
            url,
            name,
            general_voice_lines: generalVoice,
            combat_voice_lines: combatVoice,
        };
    } catch (error) {
        console.error(`Error extracting data: ${error.message}`);
        return {
            url,
            name,
            generalVoiceLanes: [],
            combatVoiceLanes: [],
            error: error.message,
        };
    }
};
