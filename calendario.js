document.addEventListener('DOMContentLoaded', () => {
    const calendarDaysGrid = document.getElementById('calendar-days-grid');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const eventForm = document.getElementById('event-form');
    const eventModal = document.getElementById('event-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalBody = document.getElementById('modal-body');
    const weekEventsList = document.getElementById('week-events-list');

    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthYear.textContent = `${monthNames[month]} de ${year}`;
        calendarDaysGrid.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Adiciona células vazias para os dias antes do início do mês
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty');
            calendarDaysGrid.appendChild(emptyCell);
        }

        // Adiciona os dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = day;
            dayCell.classList.add('day');
            
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Marca o dia de hoje
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCell.classList.add('today');
            }

            // Marca dias com eventos
            if (events.some(event => event.date === dateString)) {
                dayCell.classList.add('event-day');
            }
            
            dayCell.addEventListener('click', () => openModalForDate(dateString));
            calendarDaysGrid.appendChild(dayCell);
        }
        
        renderWeekEvents();
    };
    
    const renderWeekEvents = () => {
        weekEventsList.innerHTML = '';
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay())); // Início da semana (Domingo)
        const weekEnd = new Date(new Date(weekStart).setDate(weekStart.getDate() + 6)); // Fim da semana (Sábado)

        const weekEvents = events
            .filter(event => {
                const eventDate = new Date(event.date + 'T00:00:00'); // Considera o fuso horário local
                return eventDate >= weekStart && eventDate <= weekEnd;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time));

        if(weekEvents.length === 0) {
            weekEventsList.innerHTML = '<li><div class="event-text"><span>Nenhum evento para esta semana.</span></div></li>';
            return;
        }

        weekEvents.forEach(event => {
            const li = document.createElement('li');
            const eventDate = new Date(event.date + 'T00:00:00');
            const dayOfWeek = eventDate.toLocaleDateString('pt-BR', { weekday: 'long' });

            li.innerHTML = `
                <div class="event-text">
                    <strong>${event.title}</strong>
                    <span>${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${event.time} - ${event.church}</span>
                </div>`;
            weekEventsList.appendChild(li);
        });
    }

    const saveEvents = () => {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    };

    const openModalForDate = (dateString) => {
        modalBody.innerHTML = '';
        const eventsForDay = events.filter(e => e.date === dateString);
        const date = new Date(dateString + 'T00:00:00');
        const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

        let content = `<h3>Eventos de ${formattedDate}</h3>`;

        if (eventsForDay.length > 0) {
            eventsForDay.sort((a,b) => a.time.localeCompare(b.time)).forEach(event => {
                content += `
                    <div class="modal-event-item">
                        <strong>${event.title}</strong>
                        <p><i class="fas fa-clock"></i> Hora: ${event.time}</p>
                        <p><i class="fas fa-church"></i> Igreja: ${event.church}</p>
                    </div>`;
            });
        } else {
            content += '<p>Nenhum evento agendado para este dia.</p>';
        }

        modalBody.innerHTML = content;
        eventModal.style.display = 'flex';
    };

    // --- Event Listeners ---
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newEvent = {
            title: document.getElementById('event-title').value,
            church: document.getElementById('event-church').value,
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
        };
        events.push(newEvent);
        saveEvents();
        eventForm.reset();
        renderCalendar();
    });
    
    closeModalBtn.addEventListener('click', () => {
        eventModal.style.display = 'none';
    });
    
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            eventModal.style.display = 'none';
        }
    });

    // --- Initial Render ---
    renderCalendar();
});