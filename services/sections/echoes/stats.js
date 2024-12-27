const { cleanText } = require('../../../utils/cleanText');
const { resizeImage } = require('../../../utils/resizeImage');
module.exports = ($, url, name) => {

     
        // Ekstrak deskripsi di paragraf pertama
        let info = $('div.mw-parser-output > p').map((index, element) => cleanText($(element).text())).get().slice(0, 1).join('');
        let additionalInfo = $('div.mw-parser-output > p').map((index, element) => cleanText($(element).text())).get().slice(1,2).join('');
        const description = info + ' ' + additionalInfo;
        // Ekstrak tabel data
        const tableData = [];
        $('table.fandom-table tbody tr').each((i, row) => {
            const cells = [];
            $(row).find('td, th').each((j, cell) => {
                cells.push($(cell).text().trim());
            });
            if (cells.length) tableData.push(cells);
        });

    // Ambil properti Echoes
    const properties = $('div.mw-parser-output ul li').map((i, el) => $(el).text().trim()).get();
    // Array to store the final result
    const more_info = [];

    // Proses elemen <h2> dan tabel secara paralel berdasarkan indeks
    $('h2').each((index, h2) => {
        const title = $(h2).text().trim();
        const descriptionElements = [];
    
        // Ambil deskripsi dari elemen-elemen setelah <h2>
        let current = $(h2).next();
        while (current.length && !current.is('h2')) {
            if (current.is('p')) {
                descriptionElements.push(current.text().trim());
            }
            current = current.next();
        }
    
        // Cari tabel dengan indeks yang sama
        const tableElement = $('table.fandom-table').eq(index);
        const tableData = [];
    
        if (tableElement.length) {
            const stats = [];
            const keys = [];
    
            // Ambil key dari elemen <th> pada tabel ini
            tableElement.find('tr').first().find('th').each((_, element) => {
                keys.push($(element).text().trim().replace(/\s+/g, '_'));
            });
    
            // Loop melalui setiap baris data dalam tabel ini
            tableElement.find('tr').slice(1).each((_, rowElement) => {
                const columns = $(rowElement).find('td').toArray();
                if (columns.length > 0) {
                    const stat = {};
                    columns.forEach((column, i) => {
                        const key = keys[i] || `Column_${i + 1}`;
                        stat[key] = $(column).text().trim();
                    });
                    stats.push(stat);
                }
            });
    
            // Tambahkan data tabel ke tableData
            tableData.push(stats);
        }
    
        // Tambahkan data <h2> dengan tabel yang sesuai
        more_info.push({
            title,
            description: descriptionElements.join(' '),
            table: tableData.length > 0 ? tableData[0] : null, // Hanya ambil tabel pertama
        });
    });
    
    
    
    

     return { 
        description,
        properties,
        more_info,
        // allStats
     };
}
