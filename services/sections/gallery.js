const { chromium } = require('playwright');
const cheerio = require('cheerio');

module.exports = async ($, url, name) => {
    const cleanText = (text) => text
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || '';

    const galleries = [];
    const videos = [];
    const cache = new Map(); // Cache untuk iframe content

    // Fungsi untuk mengambil iframe content menggunakan Playwright dengan cache
    const fetchIframeContentWithPlaywright = async (iframeUrl, browser) => {
        if (cache.has(iframeUrl)) {
            return cache.get(iframeUrl);
        }

        try {
            const page = await browser.newPage();
            await page.route('**/*', (route) => {
                const request = route.request();
                if (['stylesheet', 'image', 'font'].includes(request.resourceType())) {
                    return route.abort(); // Blokir resource non-esensial
                }
                route.continue();
            });

            await page.goto(iframeUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
            const iframeElement = await page.waitForSelector('div.video-media iframe', { timeout: 60000 });
            const iframeSrc = await iframeElement.getAttribute('src');
            await page.close();

            cache.set(iframeUrl, iframeSrc || '');
            return iframeSrc || '';
        } catch (error) {
            console.error(`Error fetching iframe content with Playwright: ${iframeUrl}`, error.message);
            return '';
        }
    };

    // Fungsi untuk mengambil video dari galeri
    const extractVideos = async (gallery, browser) => {
        const galleryVideos = [];
        const videoElements = gallery.find('a.video').get();

        await Promise.all(videoElements.map(async (element) => {
            const videoElement = $(element);
            const videoHref = videoElement.attr('href');
            const videoThumbnail = videoElement.find('img.thumbimage').attr('data-src') || '';
            const videoName = videoElement.find('img.thumbimage').attr('data-video-name') || '';
            const videoKey = videoElement.find('img.thumbimage').attr('data-video-key') || '';

            const iframeUrl = `https://wutheringwaves.fandom.com${videoHref}`;
            const iframeSrc = await fetchIframeContentWithPlaywright(iframeUrl, browser);

            galleryVideos.push({
                href: videoHref,
                iframeSrc: iframeSrc,
                thumbnail: videoThumbnail,
                name: videoName,
                key: videoKey
            });
        }));

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

    let browser;
    try {
        // Launch browser sekali saja
        browser = await chromium.launch({ headless: true });

        // Loop melalui semua galeri
        for (let i = 0; i <= 28; i++) {
            const gallerySelector = `div#gallery-${i}`;
            const gallery = $(gallerySelector);

            if (!gallery.length) continue;

            const images = extractImages(gallery);
            const galleryVideos = await extractVideos(gallery, browser);

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
    } catch (error) {
        console.error(`Error processing gallery: ${error.message}`);
    } finally {
        if (browser) await browser.close(); // Tutup browser setelah selesai
    }

    return {
        name: cleanText(name),
        sourceUrl: url,
        galleries: galleries,
        videos: videos
    };
};
