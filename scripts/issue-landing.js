if (!window.matchMedia('(pointer: coarse)').matches) {
    const glow = '0 0 10px #42A6FC, 0 0 25px #42A6FC, 0 0 50px rgba(66, 166, 252, 0.5)';
    document.querySelectorAll('#main-container a').forEach(link => {
        const span = link.querySelector('span');
        link.addEventListener('mouseenter', () => {
            gsap.to(span, { scaleY: 1, textShadow: glow, duration: 0.7, ease: 'back.out(2)' });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(span, { scaleY: 30, textShadow: 'none', duration: 0.6, ease: 'power3.inOut' });
        });
    });
}
