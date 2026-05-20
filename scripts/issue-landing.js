document.querySelectorAll('#main-container a').forEach(link => {
    const span = link.querySelector('span');
    link.addEventListener('mouseenter', () => {
        gsap.to(span, { scaleY: 1, duration: 0.7, ease: 'back.out(2)' });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(span, { scaleY: 35, duration: 0.6, ease: 'power3.inOut' });
    });
});
