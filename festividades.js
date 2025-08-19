document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-festividade-btn');
    const modal = document.getElementById('festividade-modal');
    const closeModalBtn = modal.querySelector('.close-modal-btn');
    const form = document.getElementById('festividade-form');
    const grid = document.getElementById('festividade-grid');

    let festividades = JSON.parse(localStorage.getItem('churchFestividades')) || [];

    const renderGrid = () => {
        grid.innerHTML = '';
        if (festividades.length === 0) {
            grid.innerHTML = '<p>Nenhuma festividade criada. Clique em "Criar Nova Festividade" para começar.</p>';
            return;
        }
        festividades.forEach(evento => {
            const card = document.createElement('a');
            card.className = 'festividade-card';
            card.href = `festividade-detalhe.html?id=${evento.id}`;
            card.innerHTML = `
                <div class="festividade-card-icon"><i class="fas fa-star"></i></div>
                <div class="festividade-card-info">
                    <h3>${evento.title}</h3>
                    <span>${evento.date ? new Date(evento.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data não definida'}</span>
                </div>
                <div class="festividade-card-arrow"><i class="fas fa-chevron-right"></i></div>
            `;
            grid.appendChild(card);
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('festividade-title').value;
        const newEvent = {
            id: Date.now(),
            title: title,
            date: '',
            time: '',
            location: '',
            posterUrl: '',
            documents: []
        };
        festividades.unshift(newEvent);
        localStorage.setItem('churchFestividades', JSON.stringify(festividades));
        // Redireciona para a página de detalhes do evento recém-criado
        window.location.href = `festividade-detalhe.html?id=${newEvent.id}`;
    });

    addBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => e.target === modal && (modal.style.display = 'none'));

    renderGrid();
});