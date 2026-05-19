const poemButtons = document.querySelectorAll('.poemBtn');
const poems = document.querySelectorAll('.poem-content');

// show first poem by default
poems[0].classList.add('active');

poemButtons.forEach((button, index) => {
    button.addEventListener('click', () => {

        // remove active from all poems
        poems.forEach(poem => poem.classList.remove('active'));

        // add active to the clicked one
        poems[index].classList.add('active');
    });
});

poemButtons.forEach((button, index) => {
    button.addEventListener('click', () => {

        poems.forEach(poem => poem.classList.remove('active'));
        poemButtons.forEach(btn => btn.classList.remove('active'));

        poems[index].classList.add('active');
        button.classList.add('active');
    });
});

// Audio functionality 

const audioButtons = document.querySelectorAll('.audioBtn');

let currentlyPlaying = null;

function setButtonLabel(button, selector, label) {
    const labelSpan = button.querySelector(selector);
    if (labelSpan) {
        labelSpan.textContent = label;
        return;
    }

    for (const node of button.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = label;
            return;
        }
    }

    button.insertAdjacentText('afterbegin', label);
}

function setAudioButtonState(button, isPlaying) {
    setButtonLabel(button, '.audioLabel', isPlaying ? 'Listening...' : 'Listen Now');
    button.classList.toggle('is-playing', isPlaying);
}

function resetAudioButtons() {
    audioButtons.forEach(btn => setAudioButtonState(btn, false));
}

audioButtons.forEach((button) => {
    const poem = button.closest('.poem-content');
    const audio = poem.querySelector('audio');

    audio.addEventListener('ended', () => {
        setAudioButtonState(button, false);
        if (currentlyPlaying === audio) {
            currentlyPlaying = null;
        }
    });

    button.addEventListener('click', () => {
        if (currentlyPlaying === audio) {
            if (!audio.paused) {
                audio.pause();
                setAudioButtonState(button, false);
            } else {
                audio.play();
                setAudioButtonState(button, true);
            }
            return;
        }

        if (currentlyPlaying) {
            currentlyPlaying.pause();
            currentlyPlaying.currentTime = 0;
            resetAudioButtons();
        }

        audio.play();
        setAudioButtonState(button, true);
        currentlyPlaying = audio;
    });
});

poemButtons.forEach((button, index) => {
    button.addEventListener('click', () => {

        // stop audio when switching poems
        if (currentlyPlaying) {
            currentlyPlaying.pause();
            currentlyPlaying.currentTime = 0;
            currentlyPlaying = null;

            resetAudioButtons();
        }

        poems.forEach(poem => poem.classList.remove('active'));
        poemButtons.forEach(btn => btn.classList.remove('active'));

        poems[index].classList.add('active');
        button.classList.add('active');
    });
});

//Autoplay functionality
const autoplayButtons = document.querySelectorAll('.autoplayBtn');

let scrollInterval = null;
let activeAutoplayButton = null;

function setAutoplayButtonLabel(button, label) {
    const labelSpan = button.querySelector('.autoplayLabel');
    if (labelSpan) {
        labelSpan.textContent = label;
        return;
    }

    for (const node of button.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = label;
            return;
        }
    }

    button.insertAdjacentText('afterbegin', label);
}

function stopAutoplay() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }

    if (activeAutoplayButton) {
        setAutoplayButtonLabel(activeAutoplayButton, "Autoscroll");
        activeAutoplayButton = null;
    }
}

autoplayButtons.forEach(button => {
    button.addEventListener('click', () => {

        const poem = button.closest('.poem-content');
        const scrollContainer = poem ? poem.querySelector('.poem-scroll') : null;
        if (!scrollContainer) return;

        // Toggle autoplay on/off
        if (scrollInterval) {
            stopAutoplay();
            return;
        }

        setAutoplayButtonLabel(button, "Autoscrolling...");
        activeAutoplayButton = button;

        scrollInterval = setInterval(() => {
            scrollContainer.scrollTop += 1; // speed (lower = slower)

            // Stop when reaching bottom
            if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
                stopAutoplay();
            }
        }, 80); // interval speed (higher = slower)
    });
});

poemButtons.forEach((button) => {
    button.addEventListener('click', () => {
        stopAutoplay();
    });
});