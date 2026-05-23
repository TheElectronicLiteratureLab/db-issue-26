// Spatial page transition system
// Each section occupies a fixed position in a virtual 2-D map:
//
//   [Born-Digital] ← [Landing] → [A.K. Ramanujan]
//                        ↓
//                  [Statelessness]
//
// Navigating slides both sections simultaneously along their shared axis.

class PageTransition {
    constructor() {
        this.currentSection = 'issue-landing-body';
        this.sections = [
            'issue-landing-body',
            'statelessness',
            'born-digital',
            'ak-ramanujan',
        ];
        this.isTransitioning = false;
        this.init();
    }

    // Spatial coordinates (in viewport units) for each section
    static POSITIONS = {
        'issue-landing-body': { x: 0, y: 0 },
        'born-digital': { x: -1, y: 0 },
        'statelessness': { x: 0, y: 1 },
        'ak-ramanujan': { x: 1, y: 0 },
    };

    init() {
        const hashSection = window.location.hash.slice(1);
        const initial = this.sections.includes(hashSection) ? hashSection : this.sections[0];
        this.currentSection = initial;

        this.sections.forEach(id => {
            const el = document.getElementById(id);
            if (el && id !== initial) el.style.display = 'none';
        });

        this.setupNavigation();
    }

    setupNavigation() {
        document.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http')) return;
            const target = this.getTargetSection(href);
            if (target) {
                e.preventDefault();
                this.transitionTo(target);
            }
        });

        window.addEventListener('popstate', () => {
            const hash = window.location.hash.slice(1) || this.sections[0];
            if (this.sections.includes(hash)) {
                this._poppingState = true;
                this.transitionTo(hash);
                this._poppingState = false;
            }
        });
    }

    getTargetSection(href) {
        const map = {
            'index.html': 'issue-landing-body',
            'statelessness.html': 'statelessness',
            'born-digital.html': 'born-digital',
            'ramanujan.html': 'ak-ramanujan',
        };
        return map[href.split('/').pop()] ?? null;
    }

    // Returns pixel offsets for the enter and exit positions of each section.
    // Uses the dominant axis between source and destination so there are no
    // diagonal slides for cross-section jumps.
    getVectors(fromId, toId) {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const from = PageTransition.POSITIONS[fromId] ?? { x: 0, y: 0 };
        const to = PageTransition.POSITIONS[toId] ?? { x: 0, y: 0 };

        let dx = to.x - from.x;
        let dy = to.y - from.y;

        // Collapse to a single axis — use whichever has larger magnitude
        if (Math.abs(dx) >= Math.abs(dy)) {
            dx = Math.sign(dx); dy = 0;
        } else {
            dx = 0; dy = Math.sign(dy);
        }

        return {
            enterFrom: { x: dx * W, y: dy * H },
            exitTo: { x: -dx * W, y: -dy * H },
        };
    }

    transitionTo(sectionId) {
        if (sectionId === this.currentSection || this.isTransitioning) return;
        if (!this.sections.includes(sectionId)) return;

        const currentEl = document.getElementById(this.currentSection);
        const nextEl = document.getElementById(sectionId);
        if (!currentEl || !nextEl) return;

        // Instant swap for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            currentEl.style.display = 'none';
            nextEl.style.display = '';
            this.currentSection = sectionId;
            if (!this._poppingState) {
                window.history.pushState({ section: sectionId }, '', `#${sectionId}`);
            }
            this.onSectionEnter(sectionId);
            return;
        }


        this.isTransitioning = true;
        document.body.style.overflow = 'hidden';

        const { enterFrom, exitTo } = this.getVectors(this.currentSection, sectionId);

        // Place incoming section off-screen in a fixed layer before revealing it
        gsap.set(nextEl, {
            display: 'block',
            position: 'fixed',
            top: 0, left: 0,
            width: '100%', height: '100%',
            x: enterFrom.x,
            y: enterFrom.y,
            zIndex: 100,
        });

        // Fix current section so it can slide out cleanly
        gsap.set(currentEl, {
            position: 'fixed',
            top: 0, left: 0,
            width: '100%', height: '100%',
            zIndex: 99,
        });

        gsap.timeline({
            defaults: { duration: 0.75, ease: 'power3.inOut' },
            onComplete: () => {
                // Restore both sections to normal document flow
                currentEl.style.display = 'none';
                gsap.set(currentEl, { clearProps: 'position,top,left,width,height,x,y,zIndex' });
                gsap.set(nextEl, { clearProps: 'all' });

                document.body.style.overflow = '';
                window.scrollTo(0, 0);

                this.currentSection = sectionId;
                this.isTransitioning = false;

                if (!this._poppingState) {
                    window.history.pushState({ section: sectionId }, '', `#${sectionId}`);
                }

                this.onSectionEnter(sectionId);
            },
        })
            .to(currentEl, { x: exitTo.x, y: exitTo.y }, 0)
            .to(nextEl, { x: 0, y: 0 }, 0);
    }

    onSectionEnter(sectionId) {
        if (sectionId === 'born-digital') {
            const el = document.getElementById('born-digital');
            if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
        }

        if (sectionId === 'ak-ramanujan') {
            const hint = document.getElementById('ak-scroll-hint');
            const container = document.getElementById('ak-horizontal-scroll-container');
            if (hint && container) {
                container.scrollLeft = 0;
                hint.classList.remove('hidden');
            }
        }

        if (sectionId === 'statelessness') {
            const globe = document.getElementById('statelessnessGlobe');
            if (globe) gsap.set(globe, { clearProps: 'all' });
        }
    }

    goTo(sectionId) { this.transitionTo(sectionId); }
    goToIndex(index) { if (index >= 0 && index < this.sections.length) this.transitionTo(this.sections[index]); }
    getCurrentSection() { return this.currentSection; }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { window.pageTransition = new PageTransition(); });
} else {
    window.pageTransition = new PageTransition();
}
