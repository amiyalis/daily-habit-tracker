// Select DOM elements
const dateElement = document.getElementById('current-date');
const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const resetDayBtn = document.getElementById('reset-day-btn');

// Display today's date in English
const today = new Date();
const options = { weekday: 'long', month: 'long', day: 'numeric' };
dateElement.textContent = today.toLocaleDateString('en-US', options);

// Load habits from localStorage or use default starter habits
let habits = JSON.parse(localStorage.getItem('dailyHabits')) || [
  { id: 1, text: 'Drink a glass of water', completed: false },
  { id: 2, text: 'Code for 30 minutes', completed: false },
  { id: 3, text: 'Read 10 pages', completed: false }
];

// Save habits to localStorage
function saveHabits() {
  localStorage.setItem('dailyHabits', JSON.stringify(habits));
}

// Update progress bar and percentage
function updateProgress() {
  if (habits.length === 0) {
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    return;
  }

  const completedCount = habits.filter(habit => habit.completed).length;
  const percentage = Math.round((completedCount / habits.length) * 100);

  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}%`;
}

// Render habits on the screen
function renderHabits() {
  habitList.innerHTML = '';

  habits.forEach(habit => {
    const li = document.createElement('li');
    li.className = `habit-item ${habit.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="habit-left">
        <div class="checkbox">${habit.completed ? '✓' : ''}</div>
        <span class="habit-text">${habit.text}</span>
      </div>
      <button class="delete-btn" title="Delete habit">✕</button>
    `;

    // Toggle completed status when clicking the habit item
    li.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) return;
      habit.completed = !habit.completed;
      saveHabits();
      renderHabits();
    });

    // Delete habit when clicking the '✕' button
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      habits = habits.filter(item => item.id !== habit.id);
      saveHabits();
      renderHabits();
    });

    habitList.appendChild(li);
  });

  updateProgress();
}

// Add new habit
habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = habitInput.value.trim();

  if (text !== '') {
    const newHabit = {
      id: Date.now(),
      text: text,
      completed: false
    };

    habits.push(newHabit);
    habitInput.value = '';
    saveHabits();
    renderHabits();
  }
});

// Reset all habits for a new day
resetDayBtn.addEventListener('click', () => {
  habits.forEach(habit => habit.completed = false);
  saveHabits();
  renderHabits();
});

// Initial render
renderHabits();