const hamburgerMenu = document.querySelector('.hamburger-menu');
const menuModal = document.querySelector('.menu-modal');

hamburgerMenu.addEventListener('click', () => {
    menuModal.style.display = 'flex';
});

const closeBtn = document.querySelector('.close-btn-container');

closeBtn.addEventListener('click', () => {
    menuModal.style.display = 'none';
});

// Optional: Close menu when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === menuModal) {
        menuModal.style.display = 'none';
    }
});