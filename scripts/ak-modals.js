function openModal(modalId) {
    document.querySelectorAll('.akModal').forEach(m => m.classList.remove('active'));
    document.getElementById(modalId).classList.add('active');
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.querySelectorAll('.akModal').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.flip-card').forEach(c => c.classList.remove('flipped'));
    document.querySelectorAll('.akModal video').forEach(v => {
        v.pause();
        v.currentTime = 0;
    });
    document.querySelectorAll('.ak-scroll-container').forEach(el => {
        el.scrollTop = 0;
    });
}

function toggleFlip(btn) {
    const card = btn.closest('.akModal').querySelector('.flip-card');
    if (card) card.classList.toggle('flipped');
}
