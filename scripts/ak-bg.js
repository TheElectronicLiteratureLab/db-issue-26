(function () {
    var COLORS = ['#42A6FC', '#DDE1C5'];
    var COUNT = 110;

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function hexToRgb(hex) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    function init() {
        var body = document.getElementById('ak-ramanujan');
        if (!body) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
        body.insertBefore(canvas, body.firstChild);

        var ctx = canvas.getContext('2d');
        var particles = [];
        var W, H;
        var rafId = null;

        function resize() {
            W = canvas.width = body.offsetWidth;
            H = canvas.height = body.offsetHeight;
        }

        function makeParticle() {
            var color = COLORS[Math.floor(Math.random() * COLORS.length)];
            var r = rand(0.5, 2.8);
            return {
                x: rand(0, W),
                y: rand(0, H),
                r: r,
                color: hexToRgb(color),
                opacity: rand(0.08, 0.45),
                vx: rand(-0.12, 0.12),
                vy: rand(-0.08, 0.08),
                glow: r > 1.8,
            };
        }

        resize();
        window.addEventListener('resize', resize);

        for (var i = 0; i < COUNT; i++) {
            particles.push(makeParticle());
        }

        function tick() {
            ctx.clearRect(0, 0, W, H);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -4) p.x = W + 4;
                else if (p.x > W + 4) p.x = -4;
                if (p.y < -4) p.y = H + 4;
                else if (p.y > H + 4) p.y = -4;

                var fade = Math.min(1, Math.max(0, (p.x / W - 0.14) / 0.14));
                ctx.globalAlpha = p.opacity * fade;

                if (p.glow) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = p.color;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            rafId = requestAnimationFrame(tick);
        }

        function start() {
            if (!rafId) rafId = requestAnimationFrame(tick);
        }

        function stop() {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop(); else start();
        });

        new IntersectionObserver(function (entries) {
            entries[0].isIntersecting ? start() : stop();
        }, { threshold: 0.01 }).observe(body);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
