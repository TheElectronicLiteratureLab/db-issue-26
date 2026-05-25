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

    // Handle ended for both audio elements
    poem.querySelectorAll('audio').forEach(audio => {
        audio.addEventListener('ended', () => {
            if (currentlyPlaying === audio) {
                setAudioButtonState(button, false);
                currentlyPlaying = null;
            }
        });
    });

    button.addEventListener('click', () => {
        const audio = getActiveAudio(poem); // <-- dynamic lookup

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
        const scrollContainers = poem ? poem.querySelectorAll('.poem-scroll') : [];
        const scrollContainer = Array.from(scrollContainers).find(el => el.offsetParent !== null) || scrollContainers[0];
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

const translateButtons = document.querySelectorAll('.translateBtn');

translateButtons.forEach(button => {
    button.addEventListener('click', () => {
        const poem = button.closest('.poem-content');
        if (!poem) return;

        const translated = poem.querySelector('.translated-poem');
        if (!translated) return;

        const originalHeading = poem.querySelector('.poem-header h2');
        const translatedHeadingElement = translated.querySelector('h2');
        if (!originalHeading || !translatedHeadingElement) return;

        // Stop audio before switching language ↓
        const audio = poem.querySelector('audio[data-lang="en"]') || poem.querySelector('audio');
        const translatedAudio = poem.querySelector('audio[data-lang="translated"]');
        // translatedAudio will just be null if it doesn't exist, and the forEach guard handles it
        [audio, translatedAudio].forEach(a => {
            if (a && currentlyPlaying === a) {
                a.pause();
                a.currentTime = 0;
                currentlyPlaying = null;
                resetAudioButtons();
            }
        });

        if (!poem.dataset.originalHeading) {
            poem.dataset.originalHeading = originalHeading.textContent.trim();
        }

        const isTranslated = poem.classList.toggle('translation-active');
        button.textContent = isTranslated ? 'Translate' : 'Translate';
        button.classList.toggle('translation-active', isTranslated);
        button.setAttribute('aria-pressed', String(isTranslated));

        originalHeading.textContent = isTranslated ? translatedHeadingElement.textContent.trim() : poem.dataset.originalHeading;

        if (scrollInterval) {
            stopAutoplay();
        }

        const visibleScroll = Array.from(poem.querySelectorAll('.poem-scroll')).find(el => el.offsetParent !== null);
        if (visibleScroll) {
            visibleScroll.scrollTop = 0;
            updateScrollBlur(visibleScroll);
        }
    });
});

const scrollContainers = document.querySelectorAll('.poem-scroll');

function updateScrollBlur(container) {
    container.classList.toggle('scrolled', container.scrollTop > 0);
}

scrollContainers.forEach(scrollContainer => {
    scrollContainer.addEventListener('scroll', () => updateScrollBlur(scrollContainer));
    updateScrollBlur(scrollContainer);
});

function getActiveAudio(poem) {
    const isTranslated = poem.classList.contains('translation-active');
    const translatedAudio = poem.querySelector('audio[data-lang="translated"]');

    return (isTranslated && translatedAudio)
        ? translatedAudio
        : poem.querySelector('audio[data-lang="en"]');
}