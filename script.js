// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const errorMsg = document.getElementById('error-msg');
const filterBtns = document.querySelectorAll('.filter-btn');
const remainingCount = document.getElementById('remaining-count');

// Sample tasks with your example array structure
let tasks = [
  { id: 1, title: 'Buy groceries', completed: false },
  { id: 2, title: 'Read a book', completed: true },
  { id: 3, title: 'Complete internship challenge', completed: false }
];

let currentFilter = 'all';

// Initialize the app
function init() {
  renderTasks();
  updateRemainingCount();
  setupEventListeners();
}

// Render tasks based on filter
function renderTasks() {
  taskList.innerHTML = '';
  
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });
  
  if (filteredTasks.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state fade-in';
    emptyState.innerHTML = `
      <i class="fas fa-tasks"></i>
      <p>No tasks found</p>
    `;
    taskList.appendChild(emptyState);
    return;
  }
  
  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''} task-enter`;
    taskItem.style.animationDelay = `${index * 0.1}s`;
    taskItem.innerHTML = `
      <div class="task-content">
        <input 
          type="checkbox" 
          class="task-checkbox ${task.completed ? 'checkmark-animation' : ''}"
          ${task.completed ? 'checked' : ''} 
          data-id="${task.id}"
        >
        <span class="task-text">${task.title}</span>
      </div>
      <div class="task-actions">
        <button class="complete-btn rotate-on-hover" data-id="${task.id}">
          <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
        </button>
        <button class="delete-btn rotate-on-hover" data-id="${task.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Add a new task
function addTask() {
  const taskTitle = taskInput.value.trim();
  
  if (!taskTitle) {
    showError('Please enter a task title');
    return;
  }
  
  hideError();
  
  const newTask = {
    id: Date.now(),
    title: taskTitle,
    completed: false
  };
  
  tasks.push(newTask);
  taskInput.value = '';
  renderTasks();
  updateRemainingCount();
  taskInput.focus();
  
  // Add pulse animation to add button
  addTaskBtn.classList.add('pulse');
  setTimeout(() => addTaskBtn.classList.remove('pulse'), 500);
}

// Show error message
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = 'block';
  errorMsg.classList.add('show');
}

// Hide error message
function hideError() {
  errorMsg.classList.remove('show');
  setTimeout(() => {
    errorMsg.style.display = 'none';
  }, 300);
}

// Toggle task completion
function toggleTask(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
  updateRemainingCount();
}

// Delete a task
function deleteTask(id) {
  // Find task element
  const taskElement = document.querySelector(`[data-id="${id}"]`).closest('.task-item');
  
  // Add exit animation
  taskElement.style.animation = 'fadeIn 0.3s ease reverse forwards';
  
  // Remove after animation completes
  setTimeout(() => {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    updateRemainingCount();
  }, 300);
}

// Update remaining tasks count
function updateRemainingCount() {
  const remainingTasks = tasks.filter(task => !task.completed).length;
  remainingCount.textContent = remainingTasks;
  
  // Add animation to counter
  remainingCount.style.transform = 'scale(1.2)';
  setTimeout(() => {
    remainingCount.style.transform = 'scale(1)';
  }, 200);
}

// Setup event listeners
function setupEventListeners() {
  addTaskBtn.addEventListener('click', addTask);
  
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  
  taskList.addEventListener('click', (e) => {
    const target = e.target.closest('button') || e.target.closest('.task-checkbox');
    if (!target) return;
    
    const taskId = parseInt(target.getAttribute('data-id'));
    
    if (target.classList.contains('task-checkbox') || target.classList.contains('complete-btn')) {
      toggleTask(taskId);
    } else if (target.classList.contains('delete-btn')) {
      deleteTask(taskId);
    }
  });
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderTasks();
      
      // Add glow effect to active filter
      btn.classList.add('glow-on-hover');
      setTimeout(() => btn.classList.remove('glow-on-hover'), 1000);
    });
  });
}

// Initialize the app
init();