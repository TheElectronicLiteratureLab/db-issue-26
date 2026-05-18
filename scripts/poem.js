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

audioButtons.forEach((button) => {
    button.addEventListener('click', () => {

        const poem = button.closest('.poem-content');
        const audio = poem.querySelector('audio');

        // If clicking the same audio → toggle
        if (currentlyPlaying === audio) {
            if (!audio.paused) {
                audio.pause();
                button.textContent = "Listen Now";
            } else {
                audio.play();
                button.textContent = "Listening...";
            }
        } else {
            // Stop any other audio
            if (currentlyPlaying) {
                currentlyPlaying.pause();
                currentlyPlaying.currentTime = 0;

                // reset other buttons
                document.querySelectorAll('.audioBtn').forEach(btn => {
                    btn.textContent = "Listen Now";
                });
            }

            // Play new audio
            audio.play();
            button.textContent = "Listening...";
            currentlyPlaying = audio;
        }
    });
});

poemButtons.forEach((button, index) => {
    button.addEventListener('click', () => {

        // stop audio when switching poems
        if (currentlyPlaying) {
            currentlyPlaying.pause();
            currentlyPlaying.currentTime = 0;
            currentlyPlaying = null;

            document.querySelectorAll('.audioBtn').forEach(btn => {
                btn.textContent = "Listen Now";
            });
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

function stopAutoplay() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }

    if (activeAutoplayButton) {
        activeAutoplayButton.textContent = "Autoscroll";
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

        button.textContent = "Autoscrolling...";
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