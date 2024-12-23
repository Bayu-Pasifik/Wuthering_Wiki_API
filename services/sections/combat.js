module.exports = ($, url, name) => {
    // Helper function untuk membersihkan teks
    const cleanText = (text) => {
        return (text || '').trim().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    };

    // Mengambil <p> pertama
    const instruction = cleanText($('p:first').text());
    const specificUl = $('div.mw-parser-output > ul').eq(0);
    const additionalInstruction = specificUl.find('li').map((_, element) => cleanText($(element).text())).get();

    // Ambil image forte
    const imgForte = $('.autofit-image img').attr('data-src');

    // Seleksi tabel skill
    const firstTable = $('table.wikitable.skill-table'); // Pastikan tabel ini spesifik
    const rows = firstTable.find('tbody > tr'); // Ambil hanya <tr> langsung di bawah <tbody>
    const skillData = [];

    rows.each((index, element) => {
        const skill = {};

        // Ambil nama skill
        skill.name = cleanText($(element).find('td:nth-child(2) a').text());

        // Ambil tipe skill
        skill.type = cleanText($(element).find('td:nth-child(3) a').text());

        // Ambil gambar icon skill
        skill.icon = $(element).find('td:nth-child(1) img').attr('data-src');

        // Ambil deskripsi skill dari row berikutnya (hanya <td> langsung di bawah <tbody>)
        const nextRow = $(element).next();
        let description = '';

        if (nextRow.length > 0) {
            // Ambil semua <td> langsung di bawah <tr> berikutnya
            const nextTd = nextRow.find('> td'); // Selektor `> td` memastikan hanya <td> langsung di bawah <tr>
         
            filteredDescription = nextTd.map((_, element) => cleanText($(element).text())).get().join(' ');

            // Replace semua teks mulai dari `12345678910` hingga akhir
            filteredDescription = filteredDescription.replace(/12345678910.*/g, '');

            description = cleanText(filteredDescription);
        }

        skill.description = description;

        // Hanya tambah skill jika data penting tersedia
        if (skill.name && skill.type && skill.icon) {
            skillData.push(skill);
        }
    });

    // Update icon image URL (contoh: ganti '45' menjadi '1000')
    const updatedSkillData = skillData.map(skill => {
        if (skill.icon) {
            skill.icon = skill.icon.replace('45', '1000');
        }
        return skill;
    });

    // Output hasil
    return {
        name,
        img_forte: imgForte,
        instruction,
        additional_instruction: additionalInstruction,
        forte_skills: updatedSkillData,
    };
};
