
// particle idea using canvas
const canvas = document.getElementById('orb-bg');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const palette = [
    { r: 188, g: 156, b: 196 },
    { r: 221, g: 225, b: 197 },
    { r: 66, g: 166, b: 252 },
    { r: 4, g: 65, b: 79 },
    { r: 66, g: 100, b: 180 },
    { r: 245, g: 245, b: 247 },
];

function randColor() {
    return palette[Math.floor(Math.random() * palette.length)];
}

const orbs = Array.from({ length: 9 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 80 + Math.random() * 220,
    vx: (Math.random() - 0.5) * 1,
    vy: (Math.random() - 0.5) * 1,
    color: randColor(),
    alpha: 0.05 + Math.random() * 0.1,
    phase: Math.random() * Math.PI * 2,
}));

const stars = Array.from({ length: 28 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 1 + Math.random() * 3.5,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    color: randColor(),
    alpha: 0.3 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
}));

function wrap(val, min, max) {
    if (val < min) return max;
    if (val > max) return min;
    return val;
}

let last = null;
function draw(ts) {
    if (!last) last = ts;
    const dt = Math.min((ts - last) / 16.67, 3);
    last = ts;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = ts / 1000;

    orbs.forEach(o => {
        o.x += o.vx * dt;
        o.y += o.vy * dt;
        o.x = wrap(o.x, -o.r, canvas.width + o.r);
        o.y = wrap(o.y, -o.r, canvas.height + o.r);

        const pulse = o.alpha + Math.sin(t * 0.35 + o.phase) * 0.03;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `rgba(${o.color.r},${o.color.g},${o.color.b},${pulse})`);
        g.addColorStop(1, `rgba(${o.color.r},${o.color.g},${o.color.b},0)`);
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
    });

    stars.forEach(s => {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.x = wrap(s.x, 0, canvas.width);
        s.y = wrap(s.y, 0, canvas.height);

        const twinkle = s.alpha + Math.sin(t * 1.2 + s.phase) * 0.2;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.5);
        g.addColorStop(0, `rgba(${s.color.r},${s.color.g},${s.color.b},${twinkle})`);
        g.addColorStop(0.4, `rgba(${s.color.r},${s.color.g},${s.color.b},${twinkle * 0.3})`);
        g.addColorStop(1, `rgba(${s.color.r},${s.color.g},${s.color.b},0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
    });

    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);