(function () {
    var ITEMS = [];
    var rafId = null;
    var visible = false;

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function init() {
        var canvas = document.getElementById('ak-scroll-canvas');
        if (!canvas) return;

        var sections = canvas.querySelectorAll(':scope > section, :scope > a > section');

        sections.forEach(function (el) {
            ITEMS.push({
                el: el,
                ampX:   rand(3, 8),
                freqX:  (2 * Math.PI) / (rand(9, 20) * 1000),
                phaseX: rand(0, 2 * Math.PI),
                ampY:   rand(3, 7),
                freqY:  (2 * Math.PI) / (rand(11, 22) * 1000),
                phaseY: rand(0, 2 * Math.PI),
                ampR:   rand(0.4, 1.2),
                freqR:  (2 * Math.PI) / (rand(14, 28) * 1000),
                phaseR: rand(0, 2 * Math.PI),
                ampS:   rand(0.01, 0.03),
                freqS:  (2 * Math.PI) / (rand(16, 32) * 1000),
                phaseS: rand(0, 2 * Math.PI),
            });
        });

        var section = document.getElementById('ramanujan-body');
        if (!section) return;

        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                start();
            } else {
                stop();
            }
        }, { threshold: 0.01 });

        observer.observe(section);
    }

    function tick(t) {
        if (!visible) { rafId = null; return; }
        rafId = requestAnimationFrame(tick);
        for (var i = 0; i < ITEMS.length; i++) {
            var item = ITEMS[i];
            var x = item.ampX * Math.sin(item.freqX * t + item.phaseX);
            var y = item.ampY * Math.sin(item.freqY * t + item.phaseY);
            var r = item.ampR * Math.sin(item.freqR * t + item.phaseR);
            var s = 1 + item.ampS * Math.sin(item.freqS * t + item.phaseS);
            item.el.style.transform = 'translate3d(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px, 0) rotate(' + r.toFixed(3) + 'deg) scale(' + s.toFixed(4) + ')';
        }
    }

    function start() {
        if (rafId) return;
        visible = true;
        rafId = requestAnimationFrame(tick);
    }

    function stop() {
        visible = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
