module.exports = ($, url, name) => {
    return {
        name,
        weapon: $('p:contains("Weapon")').text().split(":")[1]?.trim() || '',
        combat_Role: ['Support', 'Healer'], // Placeholder, sesuaikan dengan data nyata
        source: url,
    };
};
