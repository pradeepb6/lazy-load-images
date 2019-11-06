(() => {
    if ("IntersectionObserver" in window) {
        document.addEventListener("DOMContentLoaded", () => {
            const lazyloadImages = document.querySelectorAll("img[data-lazy-src]");
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(({
                    isIntersecting,
                    target
                }) => {
                    if (isIntersecting) {
                        const image = target;
                        if (image.dataset.lazySrc) {
                            image.src = image.dataset.lazySrc;
                            delete image.dataset.lazySrc;
                        }
                        imageObserver.unobserve(image);
                    }
                });
            });

            lazyloadImages.forEach(image => {
                imageObserver.observe(image);
            });
        });
    }

    function lazyLoadImages() {
        /** Select all images with data-lazy-src */
        const images = document.querySelectorAll("img[data-lazy-src]");
        Array.prototype.slice.call(images)
            /** Add src to all visible images, this will load them */
            .forEach(img => {
                if (isElementVisible(img) && img.dataset.lazySrc) {
                    img.src = img.dataset.lazySrc;
                    delete img.dataset.lazySrc;
                }
            });

        /** Execute lazy load on window.resize, after 250ms of no resize activity. */
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(lazyLoadImages, 250);
        });
    }

    /** Execute lazy load on window.load */
    window.addEventListener("load", () => {
        lazyLoadImages()
    });

    function isElementVisible(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
    }
})();
