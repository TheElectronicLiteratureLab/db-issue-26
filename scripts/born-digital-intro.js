gsap.registerPlugin(MotionPathPlugin);

// cx/cy: circle center in SVG user units (viewBox 0 0 1920 1080)
const GROUPS = [
    { id: 'vessel', cx: 1151.19, cy: 323.81 },
    { id: 'slot_waste', cx: 960, cy: 245.12 },
    { id: 'wanderer', cx: 745, cy: 298 },
    { id: 'amber_row', cx: 618.98, cy: 483.76 },
    { id: 'my_toxic_trait_is_I_believe_the_good_is_inevitable', cx: 625.65, cy: 667.53 },
    { id: 'human_in_the_loop', cx: 742.85, cy: 833 },
    { id: 'count_zero_three', cx: 960, cy: 893.8 },
    { id: 'underwear_shopping_spree', cx: 1203.97, cy: 830.4 },
    { id: 'a_living_poem', cx: 1350.15, cy: 667.57 },
    { id: 'sketches', cx: 1455.17, cy: 478.55 },
];

gsap.set(GROUPS.map(g => '#' + g.id), { opacity: 0 });
gsap.set(GROUPS.map(g => `#${g.id} text`), { opacity: 0 });

// Path data is computed lazily on first entry to avoid blocking load
let pathData = null;

function getPathData() {
    if (pathData) return pathData;
    const pathEl = document.getElementById('spiral-motion-path');
    if (!pathEl) return null;
    const svgEl = pathEl.closest('svg');
    const startPt = pathEl.getPointAtLength(0);
    const relPart = pathEl.getAttribute('d').replace(/^M[\d.,\s-]+/, '').trim();
    const totalLen = pathEl.getTotalLength();
    const SAMPLES = 1000;

    const sorted = GROUPS.map(g => {
        let bestProgress = 0, bestDist = Infinity;
        for (let i = 0; i <= SAMPLES; i++) {
            const pt = pathEl.getPointAtLength((i / SAMPLES) * totalLen);
            const dist = Math.hypot(pt.x - g.cx, pt.y - g.cy);
            if (dist < bestDist) { bestDist = dist; bestProgress = i / SAMPLES; }
        }
        return { ...g, endProgress: bestProgress };
    }).sort((a, b) => a.endProgress - b.endProgress);

    pathData = { pathEl, svgEl, startPt, relPart, sorted };
    return pathData;
}

function drift(el) {
    gsap.to(el, {
        x: `+=${(Math.random() - 0.5) * 14}`,
        y: `+=${(Math.random() - 0.5) * 12}`,
        duration: 3 + Math.random() * 4,
        ease: 'sine.inOut',
        onComplete() { drift(el); },
    });
}

function resetGroups() {
    GROUPS.forEach(g => {
        const el = document.getElementById(g.id);
        if (!el) return;
        gsap.killTweensOf(el);
        gsap.killTweensOf(`#${g.id} text`);
        gsap.set(el, { opacity: 0, x: 0, y: 0 });
        gsap.set(`#${g.id} text`, { opacity: 0 });
    });
}

function runIntro() {
    const data = getPathData();
    if (!data) return;
    const { svgEl, startPt, relPart, sorted } = data;
    let completedCount = 0;

    sorted.forEach((g, i) => {
        const el = document.getElementById(g.id);
        if (!el) return;

        const dx = startPt.x - g.cx;
        const dy = startPt.y - g.cy;

        const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempPath.setAttribute('d', `M${dx},${dy}${relPart}`);
        tempPath.setAttribute('fill', 'none');
        tempPath.setAttribute('stroke', 'none');
        svgEl.appendChild(tempPath);

        const duration = 0.8 + g.endProgress * 2.2;

        gsap.to(el, {
            opacity: 1,
            motionPath: { path: tempPath, start: 0, end: g.endProgress },
            duration,
            delay: i * 0.08,
            ease: 'power2.inOut',
            onComplete() {
                tempPath.remove();
                drift(el);
                completedCount++;
                if (completedCount === sorted.length) {
                    gsap.to(GROUPS.map(g => `#${g.id} text`), { opacity: 1, duration: 0.6 });
                }
            },
        });
    });
}

const section = document.getElementById('born-digital');
if (section) {
    const fromBornDigital = document.referrer.includes('born-digital/');
    const isFirstVisit = !localStorage.getItem('db26-loaded');
    let initialDelayUsed = false;

    function runIntroWhenReady() {
        if (window.pageTransition?.isTransitioning) {
            setTimeout(runIntroWhenReady, 50);
        } else {
            runIntro();
        }
    }

    const io = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                if (fromBornDigital && isFirstVisit && !initialDelayUsed) {
                    initialDelayUsed = true;
                    setTimeout(runIntro, 4800);
                } else {
                    runIntroWhenReady();
                }
            } else {
                resetGroups();
            }
        },
        { threshold: 0.1 }
    );
    io.observe(section);
}