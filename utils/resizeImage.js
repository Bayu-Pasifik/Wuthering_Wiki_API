const resizeImage = (src) => {
    if (!src || typeof src !== 'string') {
        return null; // Kembalikan null jika src tidak valid
    }
    return src.replace(/scale-to-width-down\/\d+/g, 'scale-to-width-down/1000');
};

module.exports = { resizeImage };
