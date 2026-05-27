// DOM utility functions:
const el = (sel, par) => (par || document).querySelector(sel);
const els = (sel, par) => (par || document).querySelectorAll(sel);
const elNew = (tag, prop) => Object.assign(document.createElement(tag), prop);

// Helper:
const mod = (n, m) => (n % m + m) % m;

// Carousel:
const carousel = (elCarousel) => {

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animation = prefersReduced ? 0 : 500;

    const elCarouselSlider = el(".carousel-slider", elCarousel);
    const elsSlides = els(".carousel-slide", elCarouselSlider);
    const elsBtns = [];

    let tot = elsSlides.length;
    let c = 0;

    if (tot < 2) return;

    // Accessibility setup
    const carouselLabel = elCarousel.dataset.carouselLabel || "Carousel";
    const sliderId = elCarouselSlider.id || `carousel-slider-${Math.random().toString(36).slice(2)}`;
    elCarouselSlider.id = sliderId;

    elCarousel.tabIndex = 0;
    elCarousel.setAttribute("role", "region");
    elCarousel.setAttribute("aria-roledescription", "carousel");
    elCarousel.setAttribute("aria-label", carouselLabel);
    elCarousel.style.touchAction = "pan-y";

    // Slide roles
    elsSlides.forEach((slide, i) => {
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", `Slide ${i + 1} of ${tot}`);
    });

    // Live region (screen reader announcements)
    const live = elNew("div", { className: "sr-only" });
    live.setAttribute("aria-live", "polite");
    elCarousel.append(live);

    // Methods
    const anim = (ms = animation) => {
        const cMod = mod(c, tot);

        // Screen reader update
        live.textContent = `Slide ${cMod + 1} of ${tot}`;

        // Move slider
        elCarouselSlider.style.transitionDuration = `${ms}ms`;
        elCarouselSlider.style.transform = `translateX(${(-c - 1) * 100}%)`;

        // Active states
        elsSlides.forEach((elSlide, i) =>
            elSlide.classList.toggle("is-active", cMod === i)
        );

        elsBtns.forEach((elBtn, i) => {
            const isActive = cMod === i;
            elBtn.classList.toggle("is-active", isActive);
            elBtn.setAttribute("aria-current", isActive ? "true" : "false");
        });
    };

    const prev = () => {
        if (c <= -1) return;
        c -= 1;
        anim();
    };

    const next = () => {
        if (c >= tot) return;
        c += 1;
        anim();
    };

    const goto = (index) => {
        c = index;
        anim();
    };

    // Buttons
    const elPrev = elNew("button", {
        type: "button",
        className: "carousel-prev",
        innerHTML: `
        <span>
            <svg width="18" height="32" viewBox="0 0 18 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2.02743L16.227 0L0 16L16.227 32L18 29.9726L3.8295 16L18 2.02743Z" fill="#F5F5F7"/>
            </svg>
        </span>
    `,
    });

    elPrev.onclick = prev;

    const elNext = elNew("button", {
        type: "button",
        className: "carousel-next",
        innerHTML: `
        <span>
            <svg width="18" height="32" viewBox="0 0 18 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 2.02743L1.773 0L18 16L1.773 32L0 29.9726L14.1705 16L0 2.02743Z" fill="#F5F5F7"/>
            </svg>
        </span>
    `,
    });

    elNext.onclick = next;

    // Accessible labels
    elPrev.setAttribute("aria-label", "Previous slide");
    elNext.setAttribute("aria-label", "Next slide");

    // Navigation container
    const elNavigation = elNew("div", {
        className: "carousel-navigation",
    });

    // Bullets
    for (let i = 0; i < tot; i++) {
        const elBtn = elNew("button", {
            type: "button",
            className: "carousel-bullet",
            onclick: () => goto(i),
        });

        elBtn.setAttribute("aria-label", `Go to slide ${i + 1}`);
        elBtn.setAttribute("aria-controls", sliderId);

        elsBtns.push(elBtn);
    }

    // Infinite loop handling
    elCarouselSlider.addEventListener("transitionend", () => {
        if (c <= -1) c = tot - 1;
        if (c >= tot) c = 0;
        anim(0);
    });

    // Swipe support
    const swipeThreshold = 50;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerActive = false;

    const onPointerDown = (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        pointerActive = true;
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
    };

    const onPointerUp = (event) => {
        if (!pointerActive) return;
        pointerActive = false;

        const dx = event.clientX - pointerStartX;
        const dy = event.clientY - pointerStartY;

        if (Math.abs(dx) > swipeThreshold && Math.abs(dx) > Math.abs(dy)) {
            dx > 0 ? prev() : next();
        }
    };

    const onPointerCancel = () => {
        pointerActive = false;
    };

    // Keyboard support
    const onKeydown = (event) => {
        const tag = event.target.tagName.toLowerCase();
        if (["input", "textarea", "select"].includes(tag)) return;

        switch (event.key) {
            case "ArrowLeft":
            case "PageUp":
                event.preventDefault();
                prev();
                break;
            case "ArrowRight":
            case "PageDown":
                event.preventDefault();
                next();
                break;
            case "Home":
                event.preventDefault();
                goto(0);
                break;
            case "End":
                event.preventDefault();
                goto(tot - 1);
                break;
        }
    };

    elCarousel.addEventListener("keydown", onKeydown);
    elCarousel.addEventListener("pointerdown", onPointerDown);
    elCarousel.addEventListener("pointerup", onPointerUp);
    elCarousel.addEventListener("pointercancel", onPointerCancel);

    // Init UI
    elNavigation.append(...elsBtns);
    elCarousel.append(elPrev, elNext, elNavigation);

    // Clone slides for infinite effect
    elCarouselSlider.prepend(elsSlides[tot - 1].cloneNode(true));
    elCarouselSlider.append(elsSlides[0].cloneNode(true));

    // Initial render
    anim(0);
};

// Init all carousels
els(".carousel").forEach(carousel);


// Lightbox for carousel images and videos
const lightboxOverlay = document.createElement('div');
lightboxOverlay.className = 'lightbox-overlay';
lightboxOverlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&#x2715;</button>
    <img class="lightbox-img" src="" alt="" style="display:none;">
    <video class="lightbox-video" controls style="display:none; max-width:95vw; max-height:90vh;"></video>
`;
document.body.appendChild(lightboxOverlay);

const lightboxImg = lightboxOverlay.querySelector('.lightbox-img');
const lightboxVideo = lightboxOverlay.querySelector('.lightbox-video');
const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

function openLightbox(type, src, alt) {
    if (type === 'video') {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = src;
        lightboxVideo.play();
    } else {
        lightboxVideo.style.display = 'none';
        lightboxImg.style.display = 'block';
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
    }
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    lightboxVideo.pause();
    lightboxVideo.src = '';
    document.body.style.overflow = '';
}

lightboxOverlay.addEventListener('click', closeLightbox);
lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
});
lightboxVideo.addEventListener('click', (e) => e.stopPropagation()); // don't close when tapping video controls

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// Target images and videos inside carousel slides
document.querySelectorAll('.carousel-slide img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox('image', img.src, img.alt));
});

document.querySelectorAll('.carousel-slide video').forEach(video => {
    video.style.cursor = 'zoom-in';
    video.addEventListener('click', (e) => {
        e.preventDefault(); // prevent default video controls from firing
        openLightbox('video', video.querySelector('source')?.src || video.src, '');
    });
});