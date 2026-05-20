// map region id → modal id
const modalMap = {
    'basque': 'smodal-basque',
    'roma': 'smodal-roma',
    'kurds': 'smodal-kurds',
    'rohingya': 'smodal-rohingya',
    'uyghurs': 'smodal-uyghur',
    'hmong': 'smodal-hmong',
    'palestinians': 'smodal-palestinians',
    'tibetans': 'smodal-tibetans',
    'biharis': 'smodal-bihari',
    'maasai': 'smodal-maasai'
};

function resetRegions() {
    document.querySelectorAll('.statelessModal').forEach(m => m.style.display = 'none');
    document.getElementById('stateless-overlay').classList.add('hidden');
}

function toggleModal(regionId) {
    const modalId = modalMap[regionId];
    if (!modalId) return;
    const modal = document.getElementById(modalId);
    if (!modal) return;

    resetRegions();
    modal.style.display = 'flex';
    document.getElementById('stateless-overlay').classList.remove('hidden');
}

document.querySelectorAll('.region').forEach(region => {
    region.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleModal(region.id);
    });
});

document.querySelectorAll('.statelessModal button').forEach(button => {
    button.addEventListener('click', resetRegions);
});