// Todo List Application - JavaScript Implementation
// Following guidelines: arrow functions only, localStorage, input validation, popups

// Global variables
let tasks = [];
let currentEditingIndex = -1;

// DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const errorMessage = document.getElementById('errorMessage');
const noTasksMessage = document.getElementById('noTasksMessage');
const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popupTitle');
const popupMessage = document.getElementById('popupMessage');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Initialize application
const initializeApp = () => {
    loadTasksFromStorage();
    renderTasks();
    attachEventListeners();
    updateDeleteAllButton();
};

// Load tasks from localStorage
const loadTasksFromStorage = () => {
    const storedTasks = localStorage.getItem('todoTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
};

// Save tasks to localStorage
const saveTasksToStorage = () => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
};

// Input validation function
const validateTaskInput = (input) => {
    const trimmedInput = input.trim();
    
    // Check if empty
    if (trimmedInput === '') {
        return { isValid: false, message: 'Task cannot be empty. Please enter a task.' };
    }
    
    // Check if starts with a number
    if (/^\d/.test(trimmedInput)) {
        return { isValid: false, message: 'Task cannot start with a number. Please modify your input.' };
    }
    
    // Check if less than 5 characters
    if (trimmedInput.length < 5) {
        return { isValid: false, message: 'Task must be at least 5 characters long. Please add more details.' };
    }
    
    return { isValid: true, message: '' };
};

// Show error message
const showErrorMessage = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Hide error message after 5 seconds
    setTimeout(() => {
        hideErrorMessage();
    }, 5000);
};

// Hide error message
const hideErrorMessage = () => {
    errorMessage.classList.remove('show');
};

// Show popup
const showPopup = (title, message, onConfirm) => {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popup.style.display = 'flex';
    
    // Remove previous event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
        hidePopup();
        onConfirm();
    });
};

// Hide popup
const hidePopup = () => {
    popup.style.display = 'none';
};

// Add new task
const addTask = () => {
    const taskText = taskInput.value;
    const validation = validateTaskInput(taskText);
    
    if (!validation.isValid) {
        showErrorMessage(validation.message);
        return;
    }
    
    hideErrorMessage();
    
    const newTask = {
        id: Date.now(),
        text: taskText.trim(),
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasksToStorage();
    renderTasks();
    updateDeleteAllButton();
    
    // Clear input
    taskInput.value = '';
    
    // Show success popup
    showPopup(
        'Success!',
        'Task has been added successfully.',
        () => {}
    );
};

// Delete task
const deleteTask = (index) => {
    const task = tasks[index];
    showPopup(
        'Delete Task',
        `Are you sure you want to delete "${task.text}"?`,
        () => {
            tasks.splice(index, 1);
            saveTasksToStorage();
            renderTasks();
            updateDeleteAllButton();
        }
    );
};

// Edit task
const editTask = (index) => {
    const task = tasks[index];
    const newText = prompt('Edit task:', task.text);
    
    if (newText !== null) {
        const validation = validateTaskInput(newText);
        
        if (!validation.isValid) {
            showErrorMessage(validation.message);
            return;
        }
        
        tasks[index].text = newText.trim();
        saveTasksToStorage();
        renderTasks();
        
        showPopup(
            'Success!',
            'Task has been updated successfully.',
            () => {}
        );
    }
};

// Delete all tasks
const deleteAllTasks = () => {
    if (tasks.length === 0) {
        showErrorMessage('No tasks to delete.');
        return;
    }
    
    showPopup(
        'Delete All Tasks',
        `Are you sure you want to delete all ${tasks.length} tasks? This action cannot be undone.`,
        () => {
            tasks = [];
            saveTasksToStorage();
            renderTasks();
            updateDeleteAllButton();
        }
    );
};

// Update delete all button state
const updateDeleteAllButton = () => {
    if (tasks.length === 0) {
        deleteAllBtn.disabled = true;
        noTasksMessage.style.display = 'block';
    } else {
        deleteAllBtn.disabled = false;
        noTasksMessage.style.display = 'none';
    }
};

// Render tasks
const renderTasks = () => {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        updateDeleteAllButton();
        return;
    }
    
    tasks.forEach((task, index) => {
        const taskItem = createTaskElement(task, index);
        taskList.appendChild(taskItem);
    });
    
    updateDeleteAllButton();
};

// Create task element
const createTaskElement = (task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item new';
    
    li.innerHTML = `
        <div class="task-content">${escapeHtml(task.text)}</div>
        <div class="task-actions">
            <button class="edit-btn" onclick="editTask(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        </div>
    `;
    
    // Remove animation class after animation completes
    setTimeout(() => {
        li.classList.remove('new');
    }, 300);
    
    return li;
};

// Escape HTML to prevent XSS
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Attach event listeners
const attachEventListeners = () => {
    // Add task button
    addTaskBtn.addEventListener('click', addTask);
    
    // Enter key in input field
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Delete all button
    deleteAllBtn.addEventListener('click', deleteAllTasks);
    
    // Cancel button in popup
    cancelBtn.addEventListener('click', hidePopup);
    
    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            hidePopup();
        }
    });
    
    // Clear error message when typing
    taskInput.addEventListener('input', () => {
        if (errorMessage.classList.contains('show')) {
            hideErrorMessage();
        }
    });
};

// Utility function for common operations (avoiding repetition)
const showSuccessMessage = (message) => {
    showPopup('Success!', message, () => {});
};

// Function to get task statistics
const getTaskStatistics = () => {
    return {
        total: tasks.length,
        created: tasks.filter(task => task.createdAt).length
    };
};

// Function to export tasks (additional feature)
const exportTasks = () => {
    if (tasks.length === 0) {
        showErrorMessage('No tasks to export.');
        return;
    }
    
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'todo-tasks.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showSuccessMessage('Tasks exported successfully!');
};

// Function to import tasks (additional feature)
const importTasks = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedTasks = JSON.parse(e.target.result);
            if (Array.isArray(importedTasks)) {
                tasks = [...tasks, ...importedTasks];
                saveTasksToStorage();
                renderTasks();
                updateDeleteAllButton();
                showSuccessMessage('Tasks imported successfully!');
            } else {
                showErrorMessage('Invalid file format. Please select a valid JSON file.');
            }
        } catch (error) {
            showErrorMessage('Error reading file. Please select a valid JSON file.');
        }
    };
    reader.readAsText(file);
};

// Make functions globally available for onclick handlers
window.editTask = editTask;
window.deleteTask = deleteTask;
window.exportTasks = exportTasks;
window.importTasks = importTasks;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

