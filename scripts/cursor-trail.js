(() => {
    const canvas = document.getElementById('cursor-trail');
    if (!canvas) return;

    canvas.setAttribute('aria-hidden', 'true');

    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    resize();
    window.addEventListener('resize', resize);

    let mouse = { x: -999, y: -999 };
    let smooth = { x: -999, y: -999 };
    const points = [];
    const MAX = 50;
    let rafId = null;
    let last = null;

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function draw(ts) {
        const dt = last ? Math.min((ts - last) / 16.67, 3) : 1;
        last = ts;

        smooth.x += (mouse.x - smooth.x) * 0.10 * dt;
        smooth.y += (mouse.y - smooth.y) * 0.10 * dt;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        points.push({ x: smooth.x, y: smooth.y });
        if (points.length > MAX) points.shift();

        if (points.length < 3) {
            rafId = requestAnimationFrame(draw);
            return;
        }

        for (let i = 1; i < points.length; i++) {
            const prog = i / points.length;
            ctx.beginPath();
            ctx.moveTo(points[i - 1].x, points[i - 1].y);
            ctx.lineTo(points[i].x, points[i].y);
            ctx.strokeStyle = `rgba(221,225,197,${prog * 0.7})`;
            ctx.lineWidth = prog * 2.5;
            ctx.stroke();
        }

        const head = points[points.length - 1];
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 8);
        g.addColorStop(0, 'rgba(245,245,247,0.9)');
        g.addColorStop(1, 'rgba(245,245,247,0)');
        ctx.beginPath();
        ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        rafId = requestAnimationFrame(draw);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
            rafId = null;
            last = null;
        } else {
            rafId = requestAnimationFrame(draw);
        }
    });

    rafId = requestAnimationFrame(draw);
})();
