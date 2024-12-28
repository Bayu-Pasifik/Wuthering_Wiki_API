const { cleanText } = require('../../../utils/cleanText');
module.exports = ($, url, name) => {
    const introduction = $('div.mw-parser-output > p').map((index, element) => cleanText($(element).text())).get().slice(0, 1).join('');
    const additionalInfo = $('div.mw-parser-output > p').map((index, element) => cleanText($(element).text())).get().slice(1, 3).join('');

    const materials = $('table.article-table tbody tr').map((rowIndex, row) => {
        // Abaikan header tabel (rowIndex === 0)
        if (rowIndex === 0) return null;
    
        const columns = $(row).find('td');
        const headers = $('table.article-table th').map((_, th) => cleanText($(th).text())).get();
    
        // Pasangkan kolom dengan header
        const materialData = {};
        headers.forEach((header, index) => {
            materialData[header] = cleanText($(columns[index]).text());
        });
    
        return materialData;
    }).get();
    
    const selectedHeaders = ["Rarity", "✦✦✦✦✦", "✦✦✦✦", "✦✦✦", "✦✦"];
    const headers = [];
    const levelingTable = [];

    // Ambil semua elemen baris dari tabel
    $('table.wikitable tbody tr').each((rowIndex, row) => {
        const columns = $(row).find('th, td');

        if (rowIndex === 1) {
            // Ambil header dari baris ke-1
            columns.each((_, col) => {
                const headerText = cleanText($(col).text());
                if (selectedHeaders.includes(headerText)) {
                    headers.push(headerText);
                }
            });
        } else if (rowIndex > 1) {
            // Proses data hanya jika sudah melewati header
            const rowData = {};
            columns.each((colIndex, col) => {
                const header = headers[colIndex];
                if (header) {
                    rowData[header] = cleanText($(col).text());
                }
            });
            if (Object.keys(rowData).length > 0) {
                levelingTable.push(rowData);
            }
        }
    });
    
    return {
        introduction,
        additional_info: additionalInfo,
        materials,
        leveling_table: levelingTable
    }
}