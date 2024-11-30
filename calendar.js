// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Calendar container element
  const calendarContainer = document.querySelector('.calendar-container');
  
  // Get all CMS items with the specified classes
  const events = Array.from(document.querySelectorAll('.cms-item')).map(item => ({
    title: item.querySelector('.event-title')?.textContent || '',
    start: new Date(item.querySelector('.event-start')?.textContent || ''),
    end: new Date(item.querySelector('.event-end')?.textContent || ''),
    url: item.querySelector('.event-url')?.getAttribute('href') || ''
  }));

  // Function to generate calendar
  function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Create month header with Polish month names
    const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
                        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    const header = `
      <div class="calendar-header">
        <button class="prev-month">‹</button>
        <h2>${monthNames[month]} ${year}</h2>
        <button class="next-month">›</button>
      </div>
    `;

    // Create weekday headers in Polish
    const weekDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'];
    const weekDaysHtml = weekDays.map(day => `<div class="weekday">${day}</div>`).join('');

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Adjust first day to Monday-based (0 = Monday, 6 = Sunday)
    let firstWeekDay = firstDay.getDay() - 1;
    if (firstWeekDay === -1) firstWeekDay = 6;

    // Generate calendar days
    let daysHtml = '';
    const totalCells = 42; // 6 rows × 7 days
    
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstWeekDay + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= totalDays;
      const currentDate = new Date(year, month, dayNumber);
      
      // Check if there are events on this day
      const dayEvents = events.filter(event => 
        currentDate >= new Date(event.start.setHours(0,0,0,0)) && 
        currentDate <= new Date(event.end.setHours(23,59,59,999))
      );

      const dayClass = isCurrentMonth 
        ? dayEvents.length > 0 ? 'calendar-day has-event' : 'calendar-day'
        : 'calendar-day other-month';

      daysHtml += `
        <div class="${dayClass}" data-date="${currentDate.toISOString().split('T')[0]}">
          <span class="day-number">${isCurrentMonth ? dayNumber : ''}</span>
          <div class="event-markers">
            ${dayEvents.map(event => `
              <a href="${event.url}" class="event-marker" title="${event.title}"></a>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Combine all elements
    calendarContainer.innerHTML = `
      ${header}
      <div class="calendar-grid">
        ${weekDaysHtml}
        ${daysHtml}
      </div>
    `;

    // Add event listeners for navigation
    calendarContainer.querySelector('.prev-month').addEventListener('click', () => {
      generateCalendar(new Date(year, month - 1));
    });
    
    calendarContainer.querySelector('.next-month').addEventListener('click', () => {
      generateCalendar(new Date(year, month + 1));
    });
  }

  // Initialize calendar with current month
  generateCalendar(new Date());
});

// Add this CSS to your Webflow page
const styles = `
<style>
  .calendar-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: sans-serif;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
  
  .calendar-header h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .prev-month,
  .next-month {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #45539D;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #eee;
  }
  
  .weekday {
    background: white;
    padding: 1rem;
    text-align: center;
    font-weight: bold;
  }
  
  .calendar-day {
    background: white;
    min-height: 80px;
    padding: 0.5rem;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  
  .other-month {
    color: #ccc;
  }
  
  .has-event {
    background: #45539D;
    color: white;
  }
  
  .day-number {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .event-markers {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: auto;
  }
  
  .event-marker {
    display: block;
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
  }
  
  @media (max-width: 768px) {
    .calendar-day {
      min-height: 60px;
      padding: 0.25rem;
    }
    
    .weekday {
      padding: 0.5rem;
    }
    
    .event-marker {
      width: 8px;
      height: 8px;
    }
  }
</style>
`;

// Add styles to the document head
document.head.insertAdjacentHTML('beforeend', styles);
