module.exports = ($, url, name) => {
    const content = [];
    const elements = $('div.mw-parser-output').children();

    elements.each((_, el) => {
        const tag = $(el).prop('tagName').toLowerCase();
        const classes = $(el).attr('class') || '';

        if (tag === 'table') {
            // Jika elemen adalah tabel, proses tabel menjadi object
            const tableRows = [];
            $(el)
                .find('tr')
                .each((_, row) => {
                    const cells = $(row)
                        .find('th, td')
                        .map((_, cell) => $(cell).text().trim())
                        .get();
                    tableRows.push(cells);
                });
            content.push({
                type: 'table',
                classes,
                data: tableRows,
            });
        } else if (['p', 'div', 'h1', 'h2', 'h3'].includes(tag)) {
            // Proses elemen teks biasa
            content.push({
                type: tag,
                classes,
                content: $(el).text().trim(),
            });
        }
    });

    return {
        name,
        source: url,
        content,
    };
};
