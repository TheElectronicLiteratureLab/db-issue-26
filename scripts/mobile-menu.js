const hamburgerMenu = document.querySelector('.hamburger-menu');
const menuModal = document.querySelector('.menu-modal');
const menuOverlay = document.querySelector('.menu-overlay');
const closeBtn = document.querySelector('.close-btn-container');

function openMenu() {
    menuModal.classList.add('active');
    menuOverlay.classList.add('active');
    hamburgerMenu.classList.add('hidden');
}

function closeMenu() {
    menuModal.classList.remove('active');
    menuOverlay.classList.remove('active');
    hamburgerMenu.classList.remove('hidden');
}

hamburgerMenu.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);
