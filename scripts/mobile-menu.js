const hamburgerMenu = document.querySelector('.hamburger-menu');
const menuModal = document.querySelector('.menu-modal');
const closeBtn = document.querySelector('.close-btn-container');

hamburgerMenu.addEventListener('click', () => {
    menuModal.classList.add('active');
    hamburgerMenu.classList.add('hidden');
});

closeBtn.addEventListener('click', () => {
    menuModal.classList.remove('active');
    hamburgerMenu.classList.remove('hidden');
});

// Optional: Close menu when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === menuModal) {
        menuModal.classList.remove('active');
    }
});