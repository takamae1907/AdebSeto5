document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos da DOM ---
    const eventTitleH1 = document.getElementById('event-title');
    const detailsForm = document.getElementById('event-details-form');
    const eventDateInput = document.getElementById('event-date');
    const eventTimeInput = document.getElementById('event-time');
    const eventLocationInput = document.getElementById('event-location');
    const eventPosterUrlInput = document.getElementById('event-poster-url');
    const eventPosterImg = document.getElementById('event-poster-img');
    const docsTbody = document.getElementById('event-docs-tbody');
    const addDocBtn = document.getElementById('add-event-doc-btn');
    const docModal = document.getElementById('event-doc-modal');
    const closeDocModalBtn = docModal.querySelector('.close-modal-btn');
    const docForm = document.getElementById('event-doc-form');

    // --- Lógica Principal ---
    let allFestividades = JSON.parse(localStorage.getItem('churchFestividades')) || [];
    const eventId = new URLSearchParams(window.location.search).get('id');
    let currentEvent = allFestividades.find(e => e.id == eventId);

    if (!currentEvent) {
        eventTitleH1.textContent = "Festividade não encontrada";
        document.querySelector('.dossie-container').style.display = 'none';
        return;
    }

    const saveAllFestividades = () => {
        localStorage.setItem('churchFestividades', JSON.stringify(allFestividades));
    };

    const loadEventDetails = () => {
        eventTitleH1.textContent = currentEvent.title;
        eventDateInput.value = currentEvent.date || '';
        eventTimeInput.value = currentEvent.time || '';
        eventLocationInput.value = currentEvent.location || '';
        eventPosterUrlInput.value = currentEvent.posterUrl || '';
        eventPosterImg.src = currentEvent.posterUrl || 'https://via.placeholder.com/400x500.png?text=Sem+Cartaz';
        renderDocsTable();
    };

    const renderDocsTable = () => {
        docsTbody.innerHTML = '';
        if (currentEvent.documents.length === 0) {
            docsTbody.innerHTML = '<tr><td colspan="2">Nenhum documento adicionado.</td></tr>';
            return;
        }
        currentEvent.documents.forEach(doc => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${doc.name}</td>
                <td class="action-buttons">
                    <button class="action-btn delete-doc-btn" data-docid="${doc.id}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            docsTbody.appendChild(tr);
        });
    };

    // --- Handlers de Eventos ---
    detailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentEvent.date = eventDateInput.value;
        currentEvent.time = eventTimeInput.value;
        currentEvent.location = eventLocationInput.value;
        currentEvent.posterUrl = eventPosterUrlInput.value;
        
        // Atualiza o objeto no array principal
        const index = allFestividades.findIndex(e => e.id == eventId);
        allFestividades[index] = currentEvent;
        
        saveAllFestividades();
        loadEventDetails(); // Recarrega os dados na tela
        alert('Informações salvas com sucesso!');
    });

    addDocBtn.addEventListener('click', () => docModal.style.display = 'flex');
    closeDocModalBtn.addEventListener('click', () => docModal.style.display = 'none');
    docModal.addEventListener('click', (e) => e.target === docModal && (docModal.style.display = 'none'));

    docForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newDoc = {
            id: Date.now(),
            name: document.getElementById('event-doc-name').value,
            filename: document.getElementById('event-doc-filename').value
        };
        currentEvent.documents.push(newDoc);
        saveAllFestividades();
        renderDocsTable();
        docModal.style.display = 'none';
        docForm.reset();
    });

    docsTbody.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-doc-btn');
        if (deleteBtn) {
            const docId = deleteBtn.dataset.docid;
            if (confirm('Deseja excluir este documento?')) {
                currentEvent.documents = currentEvent.documents.filter(d => d.id != docId);
                saveAllFestividades();
                renderDocsTable();
            }
        }
    });

    // --- Inicialização ---
    loadEventDetails();
});