// Navigation
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    navButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// Task Tracker
const taskInput = document.getElementById('task-input');
const taskDueDate = document.getElementById('task-due-date');
const taskPriority = document.getElementById('task-priority');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const taskFilters = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.innerHTML = `
    <input type="checkbox" ${task.completed ? 'checked' : ''}>
    <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
    <span class="due-date">${task.dueDate}</span>
    <span class="priority ${task.priority}">${task.priority}</span>
    <button class="delete-task">Delete</button>
  `;
  li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
    task.completed = !task.completed;
    updateTaskDisplay();
    saveTasks();
  });
  li.querySelector('.delete-task').addEventListener('click', () => {
    tasks = tasks.filter(t => t !== task);
    updateTaskDisplay();
    saveTasks();
  });
  return li;
}

function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = taskDueDate.value;
  const priority = taskPriority.value;
  if (taskText) {
    const newTask = { text: taskText, dueDate, priority, completed: false };
    tasks.push(newTask);
    updateTaskDisplay();
    saveTasks();
    taskInput.value = '';
    taskDueDate.value = '';
    taskPriority.value = 'low';
  }
}

function updateTaskDisplay(filter = 'all') {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
  });
  filteredTasks.forEach(task => taskList.appendChild(createTaskElement(task)));
  updateDashboard();
}

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

taskFilters.forEach(filter => {
  filter.addEventListener('click', () => {
    taskFilters.forEach(f => f.classList.remove('active'));
    filter.classList.add('active');
    updateTaskDisplay(filter.dataset.filter);
  });
});

// Pomodoro Timer
let timer;
let time = 25 * 60; // 25 minutes in seconds
let isWorking = true;
const timerDisplay = document.getElementById('timer-display');
const startTimerButton = document.getElementById('start-timer');
const pauseTimerButton = document.getElementById('pause-timer');
const resetTimerButton = document.getElementById('reset-timer');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const sessionList = document.getElementById('session-list');

function updateTimerDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      if (time > 0) {
        time--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        timer = null;
        isWorking = !isWorking;
        time = isWorking ? workDurationInput.value * 60 : breakDurationInput.value * 60;
        updateTimerDisplay();
        alert(isWorking ? 'Work time!' : 'Break time!');
        logSession(isWorking ? 'Work' : 'Break');
        startTimer();
      }
    }, 1000);
  }
}

function logSession(type) {
  const li = document.createElement('li');
  li.textContent = `${type} session completed at ${new Date().toLocaleTimeString()}`;
  sessionList.prepend(li);
}

startTimerButton.addEventListener('click', startTimer);

pauseTimerButton.addEventListener('click', () => {
  clearInterval(timer);
  timer = null;
});

resetTimerButton.addEventListener('click', () => {
  clearInterval(timer);
  timer = null;
  isWorking = true;
  time = workDurationInput.value * 60;
  updateTimerDisplay();
});

workDurationInput.addEventListener('change', () => {
  if (isWorking) {
    time = workDurationInput.value * 60;
    updateTimerDisplay();
  }
});

breakDurationInput.addEventListener('change', () => {
  if (!isWorking) {
    time = breakDurationInput.value * 60;
    updateTimerDisplay();
  }
});

// Goals
const goalInput = document.getElementById('goal-input');
const goalDueDate = document.getElementById('goal-due-date');
const addGoalButton = document.getElementById('add-goal');
const goalList = document.getElementById('goal-list');

let goals = JSON.parse(localStorage.getItem('goals')) || [];

function saveGoals() {
  localStorage.setItem('goals', JSON.stringify(goals));
}

function createGoalElement(goal) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${goal.text}</span>
    <span class="due-date">${goal.dueDate}</span>
    <button class="delete-goal">Delete</button>
  `;
  li.querySelector('.delete-goal').addEventListener('click', () => {
    goals = goals.filter(g => g !== goal);
    updateGoalDisplay();
    saveGoals();
  });
  return li;
}

function addGoal() {
  const goalText = goalInput.value.trim();
  const dueDate = goalDueDate.value;
  if (goalText) {
    const newGoal = { text: goalText, dueDate };
    goals.push(newGoal);
    updateGoalDisplay();
    saveGoals();
    goalInput.value = '';
    goalDueDate.value = '';
  }
}

function updateGoalDisplay() {
  goalList.innerHTML = '';
  goals.forEach(goal => goalList.appendChild(createGoalElement(goal)));
  updateDashboard();
}

addGoalButton.addEventListener('click', addGoal);
goalInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addGoal();
});

// Dashboard
function updateDashboard() {
  const totalTasks = document.getElementById('total-tasks');
  const completedTasks = document.getElementById('completed-tasks');
  const streakCount = document.getElementById('streak-count');
  const motivationQuote = document.getElementById('motivation-quote');

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = tasks.filter(task => task.completed).length;

  // Simulating a streak count (you might want to implement actual streak tracking)
  streakCount.textContent = Math.floor(Math.random() * 10) + 1;

  // Add some motivational quotes
  const quotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "It always seems impossible until it's done. - Nelson Mandela",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill"
  ];
  motivationQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// Quick Timer
const quickTimerDisplay = document.getElementById('quick-timer-display');
const quickStartTimerButton = document.getElementById('quick-start-timer');
let quickTimer;
let quickTime = 25 * 60; // 25 minutes in seconds

function updateQuickTimerDisplay() {
  const minutes = Math.floor(quickTime / 60);
  const seconds = quickTime % 60;
  quickTimerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startQuickTimer() {
  if (!quickTimer) {
    quickTimer = setInterval(() => {
      if (quickTime > 0) {
        quickTime--;
        updateQuickTimerDisplay();
      } else {
        clearInterval(quickTimer);
        quickTimer = null;
        quickTime = 25 * 60;
        updateQuickTimerDisplay();
        alert('Quick timer finished!');
      }
    }, 1000);
    quickStartTimerButton.textContent = 'Stop';
  } else {
    clearInterval(quickTimer);
    quickTimer = null;
    quickTime = 25 * 60;
    updateQuickTimerDisplay();
    quickStartTimerButton.textContent = 'Start';
  }
}

quickStartTimerButton.addEventListener('click', startQuickTimer);

// Initialize
updateTaskDisplay();
updateGoalDisplay();
updateTimerDisplay();
updateQuickTimerDisplay();
updateDashboard();

