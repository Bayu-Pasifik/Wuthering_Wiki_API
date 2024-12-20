const resizeImage = (src) => {
    return src.replace(/scale-to-width-down\/\d+/g, 'scale-to-width-down/1000');
}

module.exports = { resizeImage };