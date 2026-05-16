// Update the masthead directional arrow based on which main section is visible
document.addEventListener('DOMContentLoaded', () => {
    const arrowLink = document.querySelector('header > a');
    if (!arrowLink) return;
    const arrowSvg = arrowLink.querySelector('svg');
    if (arrowSvg) {
        arrowSvg.style.transition = 'transform 200ms ease';
        arrowSvg.style.transformOrigin = '50% 50%';
        arrowSvg.setAttribute('data-orig-transform', arrowSvg.style.transform || '');
    }

    const setArrow = (state) => {
        if (!arrowLink || !arrowSvg) return;
        switch (state) {
            case 'hide':
                arrowLink.style.visibility = 'hidden';
                break;
            case 'up':
                arrowLink.style.visibility = 'visible';
                arrowSvg.style.transform = 'rotate(90deg)';
                break;
            case 'right':
                arrowLink.style.visibility = 'visible';
                arrowSvg.style.transform = 'rotate(180deg)';
                break;
            case 'left':
                arrowLink.style.visibility = 'visible';
                arrowSvg.style.transform = 'rotate(0deg)';
                break;
            default:
                arrowLink.style.visibility = 'hidden';
                arrowSvg.style.transform = arrowSvg.getAttribute('data-orig-transform') || '';
        }
    };

    const mapping = {
        'issue-landing-body': 'hide',
        'statelessness-body': 'up',
        'born-digital-body': 'right',
        'ramanujan-body': 'left'
    };

    const ids = Object.keys(mapping).map(id => document.getElementById(id)).filter(Boolean);
    if (ids.length === 0) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const state = mapping[entry.target.id];
                setArrow(state);
            }
        });
    }, { threshold: 0 });

    ids.forEach(el => obs.observe(el));

    const getActiveSection = () => {
        const mid = window.scrollY + window.innerHeight * 0.5;
        let active = null;
        for (const id of Object.keys(mapping)) {
            const el = document.getElementById(id);
            if (!el) continue;
            const top = el.getBoundingClientRect().top + window.scrollY;
            if (top <= mid) active = id;
        }
        return active;
    };

    const update = () => {
        const active = getActiveSection();
        if (active) setArrow(mapping[active]);
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update(); // run on load

    // fallback: on load, set based on scroll position
    const checkInitial = () => {
        for (const id of Object.keys(mapping)) {
            const el = document.getElementById(id);
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            const visible = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
            if (visible) {
                setArrow(mapping[id]);
                return;
            }
        }
    };

    checkInitial();
    window.addEventListener('resize', checkInitial);
});
