const alreadyLoaded = localStorage.getItem('db26-loaded');

const minDisplay = alreadyLoaded
    ? Promise.resolve()
    : new Promise(resolve => setTimeout(resolve, 4000));

const pageLoad = new Promise(resolve => window.addEventListener('load', resolve));

Promise.all([minDisplay, pageLoad]).then(() => {
    if (!alreadyLoaded) {
        localStorage.setItem('db26-loaded', '1');
    }
    const splash = document.getElementById('splash-screen');
    if (!splash) return;
    splash.classList.add('fade-out');
    const remove = () => splash.remove();
    splash.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 800);
});
