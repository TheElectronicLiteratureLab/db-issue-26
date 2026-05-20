(() => {
    const canvas = document.querySelector('.prism-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.setAttribute('aria-hidden', 'true');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    let w, h;
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 120);
    });

    // ---------- COLORS ----------
    const prismPalette = [
        '120,180,255',
        '90,120,255',
        '180,120,255',
        '120,255,255',
        '255,170,255',
        '200,230,255'
    ];

    const glowPalette = [
        '44,100,255',
        '0,140,255',
        '120,80,255',
        '180,220,255'
    ];

    function randomColor(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // ---------- STARS ----------
    const stars = Array.from({ length: 70 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8,
        alpha: 0.15 + Math.random() * 0.8,
        speed: 0.03 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2
    }));

    // ---------- GLOW ORBS ----------
    const glows = Array.from({ length: 8 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 120 + Math.random() * 240,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        color: randomColor(glowPalette),
        alpha: 0.04 + Math.random() * 0.05,
        phase: Math.random() * Math.PI * 2
    }));

    // ---------- LIGHT PRISMS ----------
    const prisms = Array.from({ length: 10 }, () => createPrism());

    function createPrism() {
        const edge = Math.floor(Math.random() * 4);

        let x, y;

        // spawn from screen edges
        if (edge === 0) {
            x = -100;
            y = Math.random() * h;
        } else if (edge === 1) {
            x = w + 100;
            y = Math.random() * h;
        } else if (edge === 2) {
            x = Math.random() * w;
            y = -100;
        } else {
            x = Math.random() * w;
            y = h + 100;
        }

        return {
            x,
            y,
            length: 200 + Math.random() * 500,
            width: 25 + Math.random() * 120,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.0015,
            speedX: (Math.random() - 0.5) * 0.15,
            speedY: (Math.random() - 0.5) * 0.15,
            alpha: 0.04 + Math.random() * 0.12,
            color: randomColor(prismPalette),
            blur: 40 + Math.random() * 80,
            phase: Math.random() * Math.PI * 2
        };
    }

    function wrap(obj, padding = 300) {
        if (obj.x < -padding) obj.x = w + padding;
        if (obj.x > w + padding) obj.x = -padding;
        if (obj.y < -padding) obj.y = h + padding;
        if (obj.y > h + padding) obj.y = -padding;
    }

    // ---------- DRAW PRISM ----------
    function drawPrism(p, time) {
        ctx.save();

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const pulse = p.alpha + Math.sin(time * 0.6 + p.phase) * 0.025;

        ctx.filter = `blur(${p.blur}px)`;

        const gradient = ctx.createLinearGradient(
            -p.length / 2,
            0,
            p.length / 2,
            0
        );

        gradient.addColorStop(0, `rgba(${p.color},0)`);
        gradient.addColorStop(0.2, `rgba(${p.color},${pulse * 0.35})`);
        gradient.addColorStop(0.5, `rgba(${p.color},${pulse})`);
        gradient.addColorStop(0.8, `rgba(${p.color},${pulse * 0.35})`);
        gradient.addColorStop(1, `rgba(${p.color},0)`);

        ctx.beginPath();

        ctx.moveTo(-p.length / 2, 0);
        ctx.lineTo(0, -p.width / 2);
        ctx.lineTo(p.length / 2, 0);
        ctx.lineTo(0, p.width / 2);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();

        // sharp inner beam
        ctx.filter = 'blur(8px)';

        const innerGradient = ctx.createLinearGradient(
            -p.length / 2,
            0,
            p.length / 2,
            0
        );

        innerGradient.addColorStop(0, `rgba(${p.color},0)`);
        innerGradient.addColorStop(0.5, `rgba(255,255,255,${pulse * 1.8})`);
        innerGradient.addColorStop(1, `rgba(${p.color},0)`);

        ctx.beginPath();
        ctx.moveTo(-p.length / 2, 0);
        ctx.lineTo(0, -p.width / 5);
        ctx.lineTo(p.length / 2, 0);
        ctx.lineTo(0, p.width / 5);
        ctx.closePath();

        ctx.fillStyle = innerGradient;
        ctx.fill();

        ctx.restore();
    }

    // ---------- ANIMATION ----------
    let last = 0;

    function animate(ts) {
        const dt = Math.min((ts - last) / 16.67, 2);
        last = ts;

        const t = ts * 0.001;

        ctx.clearRect(0, 0, w, h);

        // subtle vignette
        const bg = ctx.createRadialGradient(
            w / 2,
            h / 2,
            0,
            w / 2,
            h / 2,
            Math.max(w, h)
        );

        bg.addColorStop(0, '#04164F');
        bg.addColorStop(1, '#0D0D12');

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // glows
        for (const g of glows) {
            g.x += g.vx * dt;
            g.y += g.vy * dt;

            wrap(g, g.r);

            const pulse = g.alpha + Math.sin(t * 0.5 + g.phase) * 0.015;

            const grad = ctx.createRadialGradient(
                g.x,
                g.y,
                0,
                g.x,
                g.y,
                g.r
            );

            grad.addColorStop(0, `rgba(${g.color},${pulse})`);
            grad.addColorStop(1, `rgba(${g.color},0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // prisms
        ctx.globalCompositeOperation = 'screen';

        for (const p of prisms) {
            p.x += p.speedX * dt;
            p.y += p.speedY * dt;
            p.rotation += p.rotationSpeed * dt;

            wrap(p, 500);

            drawPrism(p, t);
        }

        ctx.globalCompositeOperation = 'source-over';

        // stars
        for (const s of stars) {
            const twinkle =
                s.alpha + Math.sin(t * s.speed + s.phase) * 0.3;

            const grad = ctx.createRadialGradient(
                s.x,
                s.y,
                0,
                s.x,
                s.y,
                s.r * 4
            );

            grad.addColorStop(0, `rgba(255,255,255,${twinkle})`);
            grad.addColorStop(0.5, `rgba(120,180,255,${twinkle * 0.4})`);
            grad.addColorStop(1, `rgba(255,255,255,0)`);

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();