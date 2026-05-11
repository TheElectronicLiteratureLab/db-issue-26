(() => {
    const canvas = document.getElementById('cursor-trail');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let mouse = { x: -999, y: -999 };
    let smooth = { x: -999, y: -999 };
    let points = [];
    const MAX = 50;

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    let last = null;
    function draw(ts) {
        if (!last) last = ts;
        last = ts;

        smooth.x += (mouse.x - smooth.x) * 0.10;
        smooth.y += (mouse.y - smooth.y) * 0.10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        points.push({ x: smooth.x, y: smooth.y });
        while (points.length > MAX) points.shift();

        if (points.length < 3) { requestAnimationFrame(draw); return; }

        for (let i = 1; i < points.length; i++) {
            const prog = i / points.length;
            ctx.beginPath();
            ctx.moveTo(points[i - 1].x, points[i - 1].y);
            ctx.lineTo(points[i].x, points[i].y);
            ctx.strokeStyle = `rgba(221, 225, 197, ${prog * 0.7})`;
            ctx.lineWidth = prog * 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }

        const head = points[points.length - 1];
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 8);
        g.addColorStop(0, 'rgba(245, 245, 247, 0.9)');
        g.addColorStop(1, 'rgba(245, 245, 247, 0)');
        ctx.beginPath();
        ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
})();