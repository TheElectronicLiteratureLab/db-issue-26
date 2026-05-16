const minDisplay = new Promise(resolve => setTimeout(resolve, 4000));
const pageLoad = new Promise(resolve => window.addEventListener('load', resolve));

Promise.all([minDisplay, pageLoad]).then(() => {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;
    splash.classList.add('fade-out');
    const remove = () => splash.remove();
    splash.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 800);
});
