// Update the masthead directional arrow based on which section is active
document.addEventListener('DOMContentLoaded', () => {
    const arrowLink = document.querySelector('header > a');
    if (!arrowLink) return;
    const arrowSvg = arrowLink.querySelector('svg');
    if (arrowSvg) {
        arrowSvg.style.transition = 'transform 200ms ease';
        arrowSvg.style.transformOrigin = '50% 50%';
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
        }
    };

    const mapping = {
        'issue-landing-body': 'hide',
        'statelessness': 'up',
        'born-digital': 'right',
        'ak-ramanujan': 'left'
    };

    // Set initial state — page-transition.js has already run by this point
    const initial = window.pageTransition?.getCurrentSection() ?? 'issue-landing-body';
    setArrow(mapping[initial] ?? 'hide');

    // Update on every section transition
    document.addEventListener('sectionenter', (e) => {
        const state = mapping[e.detail.sectionId];
        if (state !== undefined) setArrow(state);
    });
});
