// Aguarda o documento HTML ser completamente carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GERENCIAMENTO DO MENU ATIVO NA BARRA LATERAL ---
    const navLinks = document.querySelectorAll('.sidebar nav ul li');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove a classe 'active' de qualquer item que já a possua
            document.querySelector('.sidebar nav li.active').classList.remove('active');
            // Adiciona a classe 'active' ao item que foi clicado
            link.classList.add('active');
        });
    });


    // --- 2. CARREGAMENTO DINÂMICO DE EVENTOS ---
    // Lista de eventos (no futuro, isso pode vir de um banco de dados)
    const eventos = [
        {
            mes: 'AGO',
            dia: '25',
            titulo: 'Reunião Geral de Obreiros',
            local: 'Templo Central',
            horario: '19:30'
        },
        {
            mes: 'SET',
            dia: '10',
            titulo: 'Santa Ceia do Setor',
            local: 'Ginásio Local',
            horario: '18:00'
        },
        {
            mes: 'SET',
            dia: '22',
            titulo: 'Culto de Ensino Unificado',
            local: 'Igreja Sede',
            horario: '19:00'
        }
    ];

    const eventsContainer = document.querySelector('.events-section');

    function carregarEventos() {
        // Limpa os eventos estáticos que estavam no HTML
        // Pega todos os event-card e remove um por um
        const oldCards = eventsContainer.querySelectorAll('.event-card');
        oldCards.forEach(card => card.remove());

        // Cria e insere os novos eventos a partir da lista
        eventos.forEach(evento => {
            const eventCardHTML = `
                <div class="event-card">
                    <div class="event-date">
                        <strong>${evento.mes}</strong>
                        <span>${evento.dia}</span>
                    </div>
                    <div class="event-details">
                        <h3>${evento.titulo}</h3>
                        <p><i class="fas fa-clock"></i> ${evento.horario} - ${evento.local}</p>
                    </div>
                </div>
            `;
            // Insere o HTML do novo card dentro da seção de eventos
            eventsContainer.insertAdjacentHTML('beforeend', eventCardHTML);
        });
    }

    // Chama a função para carregar os eventos assim que a página abre
    carregarEventos();


    // --- 3. INTERATIVIDADE NOS CARDS DAS IGREJAS ---
    const churchButtons = document.querySelectorAll('.church-card .btn');

    churchButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Evita que o link '#' recarregue a página
            event.preventDefault(); 
            
            // Encontra o card "pai" do botão que foi clicado
            const card = button.closest('.church-card');
            // Pega o nome da igreja que está no título (h3) do card
            const churchName = card.querySelector('h3').innerText;

            // Exibe um alerta simples. No futuro, isso pode navegar para a página da igreja.
            alert(`Você clicou para acessar a área da: ${churchName}`);
        });
    });

});