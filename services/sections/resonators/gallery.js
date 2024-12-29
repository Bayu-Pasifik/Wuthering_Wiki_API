const axios = require('axios');
const cheerio = require('cheerio');
module.exports = async ($, url, name) => {
    const cleanText = (text) => text
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || '';

    const galleries = [];
    const videos = [];


const fetchIframeContent = async (iframeUrl) => {
    try {
        const response = await axios.get(iframeUrl);
        const $ = cheerio.load(response.data);
        // Cari elemen tertentu dalam iframe
        const iframeSrc = $('div.video-media').find('iframe').attr('src');
        return iframeSrc;
    } catch (error) {
        console.error(`Error fetching iframe content: ${iframeUrl}`, error.message);
        return '';
    }
};

    const extractVideos = async (gallery) => {
        const galleryVideos = [];
    
        // Loop semua elemen <a> dengan class video
        await Promise.all(gallery.find('a.video').map(async (_, element) => {
            const videoElement = $(element);
            const videoHref = videoElement.attr('href');
            let videoThumbnail = videoElement.find('img.thumbimage').attr('data-src') || '';
            videoThumbnail= videoThumbnail.replace(/scale-to-width-down\/\d+/g, 'scale-to-width-down/1000');
            const videoName = videoElement.find('img.thumbimage').attr('data-video-name') || '';
            const videoKey = videoElement.find('img.thumbimage').attr('data-video-key') || '';
            
            // Build URL untuk iframe
            const iframeUrl = `https://wutheringwaves.fandom.com${videoHref}`;
            const iframeSrc = await fetchIframeContent(iframeUrl); // Request halaman iframe
    
            galleryVideos.push({
                href: `https://wutheringwaves.fandom.com${videoHref}`,
                iframeSrc: iframeSrc, // URL iframe
                thumbnail: videoThumbnail,
                name: videoName,
                key: videoKey
            });
        }).get());
    
        return galleryVideos;
    };
    
    // Fungsi untuk mengambil gambar dari galeri
    const extractImages = (gallery) => {
        const galleryImages = [];
        gallery.find('div.wikia-gallery-item').each((_, element) => {
            const imgElement = $(element).find('img.thumbimage');
            const imgTitle = $(element).find('div.lightbox-caption').text().trim() || imgElement.attr('alt') || '';
            let imgSrc = imgElement.attr('data-src') || imgElement.attr('src');

            if (imgSrc) {
                imgSrc = imgSrc.replace(/scale-to-width-down\/\d+/g, 'scale-to-width-down/1000');
                galleryImages.push({ img_src: imgSrc, title: imgTitle });
            }
        });

        return galleryImages;
    };

    // Loop through gallery indices up to 28+
    for (let i = 0; i <= 28; i++) {
        const gallerySelector = `div#gallery-${i}`;
        const gallery = $(gallerySelector);

        if (!gallery.length) continue;

        const images = extractImages(gallery);
        const galleryVideos = await extractVideos(gallery); // Await video extraction

        if (images.length > 0) {
            galleries.push({
                galleryIndex: i,
                images: images
            });
        }

        if (galleryVideos.length > 0) {
            videos.push(...galleryVideos);
        }
    }

    return {
        name: cleanText(name),
        sourceUrl: url,
        galleries: galleries,
        videos: videos
    };
};
