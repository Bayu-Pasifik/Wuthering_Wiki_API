module.exports = ($, url, name) => {
    return {
        name,
        about: $('p:contains("About")').text().split(":")[1]?.trim() || '',
        introduction: $('p:contains("Introduction")').text().split(":")[1]?.trim() || '',
        source: url,
    };
};
