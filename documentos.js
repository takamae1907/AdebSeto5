document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos da DOM ---
    const addDocumentBtn = document.getElementById('add-document-btn');
    const modal = document.getElementById('document-modal');
    const closeModalBtn = modal.querySelector('.close-modal-btn');
    const documentForm = document.getElementById('document-form');
    const tableBody = document.getElementById('documents-table-body');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const fileInput = document.getElementById('document-file-input');
    const fileNameDisplay = document.getElementById('file-name-display');

    let documents = [];
    const sampleData = [
        { id: 1, name: 'Ata da Reunião Mensal', category: 'Ata de Reunião', uploadDate: '2025-08-15', filename: 'ata_reuniao_ago_2025.pdf' },
        { id: 2, name: 'Balanço Financeiro Julho', category: 'Relatório Financeiro', uploadDate: '2025-08-05', filename: 'balanco_jul_2025.xlsx' },
        { id: 3, name: 'Circular sobre a Escola Bíblica', category: 'Circular', uploadDate: '2025-07-28', filename: 'circular_ebd.docx' },
    ];

    // --- Funções Principais ---

    const saveDocuments = () => localStorage.setItem('churchDocuments', JSON.stringify(documents));
    const loadDocuments = () => {
        const stored = localStorage.getItem('churchDocuments');
        documents = stored ? JSON.parse(stored) : sampleData;
        if (!localStorage.getItem('churchDocuments')) saveDocuments();
    };

    const renderTable = () => {
        tableBody.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        const filtered = documents.filter(doc =>
            doc.name.toLowerCase().includes(searchTerm) && (selectedCategory === 'all' || doc.category === selectedCategory)
        );

        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">Nenhum documento encontrado.</td></tr>';
            return;
        }

        filtered.forEach(doc => {
            const fileExt = doc.filename.split('.').pop();
            let icon = 'fa-file';
            if (['pdf'].includes(fileExt)) icon = 'fa-file-pdf';
            if (['doc', 'docx'].includes(fileExt)) icon = 'fa-file-word';
            if (['xls', 'xlsx'].includes(fileExt)) icon = 'fa-file-excel';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><i class="fas ${icon}"></i> ${doc.name}</td>
                <td>${doc.category}</td>
                <td>${new Date(doc.uploadDate + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                <td class="action-buttons">
                    <button class="action-btn download-btn" title="Baixar"><i class="fas fa-download"></i></button>
                    <button class="action-btn edit-btn" title="Editar" data-id="${doc.id}"><i class="fas fa-pencil-alt"></i></button>
                    <button class="action-btn delete-btn" title="Excluir" data-id="${doc.id}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    };
    
    // --- Modal ---
    const openModal = () => modal.style.display = 'flex';
    const closeModal = () => {
        modal.style.display = 'none';
        documentForm.reset();
        fileNameDisplay.textContent = '';
        document.getElementById('document-id').value = '';
        const currentFilenameInput = document.getElementById('current-filename');
        if (currentFilenameInput) currentFilenameInput.remove();
        modal.querySelector('#modal-title').textContent = 'Adicionar Novo Documento';
    };

    // --- Handlers ---
    addDocumentBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => e.target === modal && closeModal());

    fileInput.addEventListener('change', () => {
        fileNameDisplay.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : '';
    });

    documentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('document-id').value;
        const currentFilename = document.getElementById('current-filename')?.value;
        const hasNewFile = fileInput.files.length > 0;
        let filename = hasNewFile ? fileInput.files[0].name : currentFilename;

        if (!filename) {
            alert('Por favor, selecione um arquivo.');
            return;
        }

        const docData = {
            name: document.getElementById('document-name').value,
            category: document.getElementById('document-category').value,
            filename: filename
        };

        if (id) { // Editando
            const index = documents.findIndex(doc => doc.id == id);
            documents[index] = { ...documents[index], ...docData };
        } else { // Adicionando
            docData.id = Date.now();
            docData.uploadDate = new Date().toISOString().split('T')[0];
            documents.push(docData);
        }

        saveDocuments();
        renderTable();
        closeModal();
    });

    tableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('button.action-btn');
        if (!btn) return;
        
        const id = btn.dataset.id;
        if (btn.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja excluir este documento?')) {
                documents = documents.filter(doc => doc.id != id);
                saveDocuments();
                renderTable();
            }
        } else if (btn.classList.contains('edit-btn')) {
            const doc = documents.find(d => d.id == id);
            document.getElementById('document-id').value = doc.id;
            document.getElementById('document-name').value = doc.name;
            document.getElementById('document-category').value = doc.category;
            fileNameDisplay.textContent = doc.filename;
            
            if (!document.getElementById('current-filename')) {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.id = 'current-filename';
                documentForm.appendChild(hiddenInput);
            }
            document.getElementById('current-filename').value = doc.filename;
            
            modal.querySelector('#modal-title').textContent = 'Editar Documento';
            openModal();
        }
    });

    searchInput.addEventListener('input', renderTable);
    categoryFilter.addEventListener('change', renderTable);

    // --- Inicialização ---
    loadDocuments();
    renderTable();
});