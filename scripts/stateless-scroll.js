const container = document.getElementById('globe-scroll');

container.scrollLeft =
    (container.scrollWidth - container.clientWidth) / 2;

const globeScroll = document.getElementById('globe-scroll');
if (globeScroll && window.innerWidth <= 767) {
    globeScroll.scrollLeft = (globeScroll.scrollWidth - globeScroll.clientWidth) / 2;
}

function centerGlobe() {
    const globeScroll = document.getElementById('globe-scroll');
    if (globeScroll && window.innerWidth <= 767) {
        globeScroll.scrollLeft = (globeScroll.scrollWidth - globeScroll.clientWidth) / 2;
    }
}

document.addEventListener('DOMContentLoaded', centerGlobe);
window.addEventListener('resize', centerGlobe);