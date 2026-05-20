(function () {
    var audioContexts = {};
    var animFrames = {};

    function setupCarousel() {
        var modal = document.getElementById('modal-radio');
        if (!modal) return;

        var tracks = Array.from(modal.querySelectorAll('.ak-audio-track'));
        if (!tracks.length) return;

        var current = 0;
        tracks[0].classList.add('active');

        // Inject navigation
        var carousel = modal.querySelector('.ak-audio-carousel');

        var nav = document.createElement('div');
        nav.className = 'ak-audio-nav';

        var arrowSvg = '<svg width="13" height="23" viewBox="0 0 26 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 2.88275L23.439 0L0 22.75L23.439 45.5L26 42.6172L5.5315 22.75L26 2.88275Z" fill="currentColor"/></svg>';

        var prevBtn = document.createElement('button');
        prevBtn.className = 'ak-audio-nav-btn';
        prevBtn.innerHTML = arrowSvg;
        prevBtn.setAttribute('aria-label', 'Previous recording');

        var bulletsDiv = document.createElement('div');
        bulletsDiv.className = 'ak-audio-bullets';

        var bullets = tracks.map(function (_, i) {
            var b = document.createElement('button');
            b.className = 'ak-audio-bullet' + (i === 0 ? ' active' : '');
            b.setAttribute('aria-label', 'Recording ' + (i + 1));
            b.addEventListener('click', function () { goTo(i); });
            bulletsDiv.appendChild(b);
            return b;
        });

        var nextBtn = document.createElement('button');
        nextBtn.className = 'ak-audio-nav-btn';
        nextBtn.innerHTML = '<svg width="13" height="23" viewBox="0 0 26 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 2.88275L23.439 0L0 22.75L23.439 45.5L26 42.6172L5.5315 22.75L26 2.88275Z" fill="currentColor" transform="rotate(180 13 23)"/></svg>';
        nextBtn.setAttribute('aria-label', 'Next recording');

        nav.append(prevBtn, bulletsDiv, nextBtn);
        carousel.appendChild(nav);

        prevBtn.addEventListener('click', function () {
            goTo((current - 1 + tracks.length) % tracks.length);
        });
        nextBtn.addEventListener('click', function () {
            goTo((current + 1) % tracks.length);
        });

        function goTo(index) {
            var currentAudio = tracks[current].querySelector('audio');
            if (currentAudio) currentAudio.pause();

            tracks[current].classList.remove('active');
            bullets[current].classList.remove('active');
            current = index;
            tracks[current].classList.add('active');
            bullets[current].classList.add('active');
        }

        // Wire up visualizer for each track
        tracks.forEach(function (track, i) {
            var audio = track.querySelector('audio');
            var canvas = track.querySelector('.ak-audio-viz');
            if (audio && canvas) setupViz(audio, canvas, i);
        });
    }

    function setupViz(audio, canvas, id) {
        function syncSize() {
            canvas.width = canvas.offsetWidth || 480;
            canvas.height = canvas.offsetHeight || 72;
        }

        audio.addEventListener('play', function () {
            syncSize();

            if (!audioContexts[id]) {
                var actx = new (window.AudioContext || window.webkitAudioContext)();
                var source = actx.createMediaElementSource(audio);
                var analyser = actx.createAnalyser();
                analyser.fftSize = 2048;
                source.connect(analyser);
                analyser.connect(actx.destination);
                audioContexts[id] = { actx: actx, analyser: analyser };
            }

            var ac = audioContexts[id];
            if (ac.actx.state === 'suspended') ac.actx.resume();

            if (animFrames[id]) cancelAnimationFrame(animFrames[id]);
            drawWaveform(ac.analyser, canvas, id);
        });

        function stopDraw() {
            if (animFrames[id]) {
                cancelAnimationFrame(animFrames[id]);
                delete animFrames[id];
            }
        }

        audio.addEventListener('pause', stopDraw);
        audio.addEventListener('ended', stopDraw);
    }

    function drawWaveform(analyser, canvas, id) {
        var ctx = canvas.getContext('2d');
        var bufLen = analyser.frequencyBinCount;
        var data = new Uint8Array(bufLen);

        function draw() {
            animFrames[id] = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(data);

            var W = canvas.width;
            var H = canvas.height;

            ctx.clearRect(0, 0, W, H);

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#42A6FC';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(66, 166, 252, 0.6)';

            ctx.beginPath();
            var step = W / bufLen;
            var x = 0;
            for (var i = 0; i < bufLen; i++) {
                var y = (data[i] / 128) * (H / 2);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                x += step;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        draw();
    }

    // Wrap closeModal to clean up audio and animation frames
    var origClose = window.closeModal;
    window.closeModal = function () {
        var modal = document.getElementById('modal-radio');
        if (modal) {
            modal.querySelectorAll('audio').forEach(function (a) {
                a.pause();
                a.currentTime = 0;
            });
        }
        Object.keys(animFrames).forEach(function (id) {
            cancelAnimationFrame(animFrames[id]);
        });
        animFrames = {};
        if (origClose) origClose();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupCarousel);
    } else {
        setupCarousel();
    }
})();
