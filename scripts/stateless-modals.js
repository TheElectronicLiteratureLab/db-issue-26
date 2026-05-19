function resetRegions() {
    document.querySelectorAll('.statelessModal').forEach(m => {
        m.style.display = 'none';
    });
    document.querySelectorAll('.region').forEach(r => {
        r.style.zIndex = '';
    });
}

function toggleModal(region) {
    const modal = region.querySelector('.statelessModal');

    resetRegions();

    if (modal) {
        modal.style.display = 'flex';
        region.style.zIndex = '100';
    }
}

document.addEventListener('click', function (e) {
    const isRegion = e.target.closest('.region');
    const isModal = e.target.closest('.statelessModal');

    if (!isRegion && !isModal) {
        resetRegions();
    }
});

document.querySelectorAll('.region').forEach(region => {
    region.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleModal(region);
    });
});
