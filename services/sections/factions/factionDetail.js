const { cleanText } = require('../../../utils/cleanText');
const { resizeImage } = require('../../../utils/resizeImage');
module.exports = ($, url, name) => {
    const introduction = () => {
        const paragraphs = [];
        $('p').each((index, element) => {
            const text = cleanText($(element).text());
            if (text) {
                paragraphs.push(text);
            }
        });
        if (name === 'Fractsidus') {
            return paragraphs.slice(0, 5).join(' ');
        }
        // Gabungkan semua paragraf yang relevan
        return paragraphs.slice(0, 1).join(' '); // Ambil maksimal 1 paragraf pertama
    };

    const sideInfo = $('aside.portable-infobox');
    const title = sideInfo.find('h2').text().trim();
    const moreInfo = {};

    // Cari setiap section dengan kelas tertentu
    const sections = $('section.pi-item.pi-group.pi-border-color');
    sections.each((_, section) => {
        const sectionData = {};
        const panels = $(section).find('section.pi-item.pi-panel.pi-border-color');

        panels.each((_, panel) => {
            const tabContents = $(panel).find('.wds-tab__content.wds-is-current');

            tabContents.each((_, content) => {
                const items = $(content).find('.pi-item.pi-data.pi-item-spacing.pi-border-color');

                items.each((_, item) => {
                    const label = $(item).find('.pi-data-label').text().trim();
                    const value = $(item).find('.pi-data-value').text().trim();

                    if (label) {
                        sectionData[label] = value;
                    }
                });
            });
        });

        // Gabungkan data section ke `moreInfo`
        Object.assign(moreInfo, sectionData);
    });

    const notablePersonel = [];
    let imageIcon = '';
    const replaceBrWithSymbol = (html, symbol = ', ') => {
        return html.replace(/<br\s*\/?>/g, symbol); // Ganti semua <br> dengan simbol
    };
    $('table.article-table:eq(0) tbody tr').each((index, element) => {
        if (index === 0) return; // Skip header
        const columns = $(element).find('td');
        const rawImage = $(columns[0]).find('img').attr('src');

        // Periksa apakah rawImage adalah data URL
        if (rawImage && rawImage.includes("data:image")) {
            imageIcon = $(columns[0]).find('img').attr('data-src');
        } else {
            imageIcon = resizeImage(rawImage);
        }

        const name = cleanText($(columns[1]).text());
        const rawPosition = replaceBrWithSymbol($(columns[2]).html());
        const position = cleanText(rawPosition);
        notablePersonel.push({ imageIcon, name, position });
    });

    const parseListText = (ulElement) => {
        const texts = [];
        $(ulElement).children('li').each((_, li) => {
            const text = $(li).find('> a .toctext').text().trim();
            if (text) texts.push(text);

            // Rekursi untuk sub-<ul>
            const subTexts = parseListText($(li).children('ul'));
            texts.push(...subTexts);
        });
        return texts;
    };

    // Ambil semua teks dari <ul> utama
    let tocTexts = parseListText($('#toc > ul'));
    const excludeTexts = [
        "Gallery",
        "Videos",
        "Other Languages",
        "Navigation",
        "Members",
        "Notable Personnel",
        "Consultants",
        "KU-Roro",
        
    ];
    tocTexts = tocTexts.filter(text => !excludeTexts.includes(text));

    // Ambil data tentang (about) berdasarkan h2 dan h3
    const about = [];
    $('h2 span.mw-headline, h3 span.mw-headline').each((_, heading) => {
        const titleText = cleanText($(heading).text());
        if (tocTexts.includes(titleText)) {
            const content = [];
    
            if (titleText === 'Trivia') {
                let next = $(heading).closest('h2, h3').next();
    
                // Cari elemen <ul> terdekat setelah heading
                while (next.length && !next.is('h2, h3')) {
                    if (next.is('ul')) {
                        next.find('li').each((_, li) => {
                            const text = cleanText($(li).text());
                            if (text) content.push(text);
                        });
                        break; // Hentikan setelah menemukan <ul>
                    }
                    next = next.next();
                }
            } else {
                let next = $(heading).closest('h2, h3').next();
    
                while (next.length && !next.is('h2, h3')) {
                    if (next.is('p') || next.is('div')) {
                        const text = cleanText(next.text());
                        if (text) content.push(text);
                    }
                    next = next.next();
                }
            }
    
            about.push({
                title: titleText,
                content: titleText === 'Trivia' ? content.join(', ') : content.join(' ')
            });
        }
    });
    

    


    return {
        name: title,
        introduction: introduction(),
        more_introduction: moreInfo,
        notable_personel: notablePersonel,
        more_info: about
    };
};
