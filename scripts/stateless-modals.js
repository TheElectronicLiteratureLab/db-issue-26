function toggleModal(region) {
    const modal = region.querySelector('.statelessModal');

    // Close ALL modals first
    document.querySelectorAll('.statelessModal').forEach(m => {
        m.style.display = 'none';
    });

    // Open the clicked one (if it exists)
    if (modal) {
        modal.style.display = 'flex';
    }
}

document.addEventListener('click', function (e) {
    const isRegion = e.target.closest('.region');
    const isModal = e.target.closest('.statelessModal');

    if (!isRegion && !isModal) {
        document.querySelectorAll('.statelessModal').forEach(m => {
            m.style.display = 'none';
        });
    }
});

document.querySelectorAll('.region').forEach(region => {
    region.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleModal(region);
    });
});
