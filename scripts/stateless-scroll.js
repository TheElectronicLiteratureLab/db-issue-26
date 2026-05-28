function centerGlobe() {
    const globeScroll = document.getElementById('globe-scroll');
    if (globeScroll && window.innerWidth <= 767) {
        globeScroll.scrollLeft = (globeScroll.scrollWidth - globeScroll.clientWidth) / 2;
    }
}

centerGlobe();
window.addEventListener('resize', centerGlobe);
