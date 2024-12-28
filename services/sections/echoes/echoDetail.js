const { resizeImage } = require("../../../utils/resizeImage");

module.exports = ($, url, name) => {
    const aside = $('aside.pi-layout-default');
    const title = aside.find('h2[data-source="name"]').text().trim();
    const id = aside.find('h2[data-item-name="no"]').text().trim();
    const icon = aside.find('figure.pi-item img').attr('src');

    const rarity = aside.find('td[data-source="rarity"] img').map((i, el) => ({
        rarity: $(el).attr('title'),
        image: $(el).attr('src').includes("data:image/gif")
            ? $(el).attr('data-src')
            : $(el).attr('src'),
    })).get();

    const category = aside.find('div[data-source="class"] .pi-data-value').text().trim().split(' ')[0];
    const cost = parseInt(aside.find('div[data-source="cost"] .pi-data-value').text().trim()[0], 10);

    const echoSkill = aside.find('td[data-source^="eff_rank"]').map((i, el) => ({
        rank: i + 2, // Rank starts from 2
        description: $(el).text()?.trim() || "", // Ensure it's not undefined
    })).get();

    const sonataEffect = $('td[data-source="sonata_eff"] a')
        .map((i, el) => {
            const name = $(el).attr('title') || "Unknown";
            const src = resizeImage($(el).find('img').attr('src'));
            return src.includes("data:image/gif") ? null : { name, image: src };
        })
        .get()
        .filter((item, index, self) => item && self.findIndex(el => el.name === item.name && el.image === item.image) === index); // Remove duplicates

    return {
        name: title || "Unknown",
        id: id || "N/A",
        icon: icon || "N/A",
        rarity: rarity.length > 0 ? rarity : "N/A",
        category: category || "N/A",
        cost: cost || "N/A",
        sonata_effect: sonataEffect.length > 0 ? sonataEffect : "N/A",
        echo_skill: echoSkill.length > 0 ? echoSkill : "N/A",
    };
};
