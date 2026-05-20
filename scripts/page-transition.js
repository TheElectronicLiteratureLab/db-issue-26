// Page Transition System
// Manages smooth transitions between body sections

class PageTransition {
    constructor() {
        this.currentSection = 'issue-landing-body';
        this.sections = [
            'issue-landing-body',
            'statelessness-body',
            'born-digital-body',
            'ramanujan-body'
            // Add more section IDs as needed
        ];
        this.transitionDuration = 500; // milliseconds
        this.init();
    }

    init() {
        const hashSection = window.location.hash.slice(1);
        const initialSection = this.sections.includes(hashSection) ? hashSection : this.sections[0];
        this.currentSection = initialSection;

        this.sections.forEach((section) => {
            const element = document.getElementById(section);
            if (element) {
                element.classList.add('page-section');
                if (section !== initialSection) {
                    element.style.display = 'none';
                    element.classList.add('hidden');
                } else {
                    element.classList.add('active');
                }
            }
        });

        // Set up navigation listeners
        this.setupNavigation();
    }

    setupNavigation() {
        // Handle internal navigation links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('http')) return;

            // Check if link points to a known section
            const targetSection = this.getTargetSection(href);
            if (targetSection && this.sections.includes(targetSection)) {
                e.preventDefault();
                this.transitionTo(targetSection);
            }
        });

        // Handle back navigation in browser
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.slice(1) || this.sections[0];
            if (this.sections.includes(hash)) {
                this.transitionTo(hash);
            }
        });
    }

    getTargetSection(href) {
        // Map URLs to section IDs
        const urlMap = {
            'index.html': 'issue-landing-body',
            'statelessness.html': 'statelessness-body',
            'born-digital.html': 'born-digital-body',
            'ramanujan.html': 'ramanujan-body'
        };

        // Extract filename from href
        const filename = href.split('/').pop();
        return urlMap[filename] || null;
    }

    transitionTo(sectionId) {
        if (sectionId === this.currentSection) return;
        if (!this.sections.includes(sectionId)) return;

        const currentElement = document.getElementById(this.currentSection);
        const nextElement = document.getElementById(sectionId);

        if (!currentElement || !nextElement) return;

        // Start fade out of current section
        currentElement.classList.remove('active');
        currentElement.classList.add('hidden');

        // After fade out, switch sections and fade in
        setTimeout(() => {
            currentElement.style.display = 'none';
            nextElement.style.display = '';

            // Trigger reflow to ensure CSS transition happens
            void nextElement.offsetWidth;

            nextElement.classList.remove('hidden');
            nextElement.classList.add('active');

            this.currentSection = sectionId;
            this.onSectionEnter(sectionId);

            // Update browser history
            window.history.pushState({ section: sectionId }, '', `#${sectionId}`);

            // Scroll to top
            window.scrollTo(0, 0);
        }, this.transitionDuration);
    }

    onSectionEnter(sectionId) {

        // STATELESSNESS SECTION
        if (sectionId === 'statelessness-body') {

            const globe = document.getElementById('statelessnessGlobe');
            const globeScroll = document.getElementById('globe-scroll');

            gsap.killTweensOf(globe);

            gsap.set(globe, {
                y: window.innerHeight,
                opacity: 0,
                scale: 0.96
            });

            gsap.to(globe, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.8,
                ease: "power4.out"
            });
        }
    }

    // Convenience method to go to a specific section
    goTo(sectionId) {
        this.transitionTo(sectionId);
    }

    // Method to navigate by index
    goToIndex(index) {
        if (index >= 0 && index < this.sections.length) {
            this.transitionTo(this.sections[index]);
        }
    }

    // Get current section name
    getCurrentSection() {
        return this.currentSection;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pageTransition = new PageTransition();
    });
} else {
    window.pageTransition = new PageTransition();
}
