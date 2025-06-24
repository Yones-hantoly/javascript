
let tasks = [];
let currentEditingIndex = -1;


const logError = (error, context) => {
    console.error(`[TodoApp Error] ${context}:`, error);
  
};


const safeLocalStorage = {
    getItem: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            logError(error, 'localStorage.getItem');
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            logError(error, 'localStorage.setItem');
            return false;
        }
    }
};


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


const initializeApp = () => {
    loadTasksFromStorage();
    renderTasks();
    attachEventListeners();
    updateDeleteAllButton();
};


const loadTasksFromStorage = () => {
    try {
        const storedTasks = safeLocalStorage.getItem('todoTasks');
        if (storedTasks) {
            const parsedTasks = JSON.parse(storedTasks);
            if (Array.isArray(parsedTasks)) {
                tasks = parsedTasks;
            } else {
                logError('Invalid tasks data format', 'loadTasksFromStorage');
                tasks = [];
            }
        }
    } catch (error) {
        logError(error, 'loadTasksFromStorage - JSON.parse');
        tasks = [];
    }
};


const saveTasksToStorage = () => {
    try {
        const success = safeLocalStorage.setItem('todoTasks', JSON.stringify(tasks));
        if (!success) {
            showErrorMessage('Failed to save tasks. Please try again.');
        }
    } catch (error) {
        logError(error, 'saveTasksToStorage');
        showErrorMessage('Failed to save tasks. Please try again.');
    }
};


const validateTaskInput = (input) => {
    const trimmedInput = input.trim();
    

    if (trimmedInput === '') {
        return { isValid: false, message: 'Task cannot be empty. Please enter a task.' };
    }
    
   
    if (/^\d/.test(trimmedInput)) {
        return { isValid: false, message: 'Task cannot start with a number. Please modify your input.' };
    }
    
 
    if (trimmedInput.length < 5) {
        return { isValid: false, message: 'Task must be at least 5 characters long. Please add more details.' };
    }
    
    return { isValid: true, message: '' };
};


const showErrorMessage = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
 
    setTimeout(() => {
        hideErrorMessage();
    }, 5000);
};


const hideErrorMessage = () => {
    errorMessage.classList.remove('show');
};


const showPopup = (title, message, onConfirm) => {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popup.style.display = 'flex';
    
    
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
 
    newConfirmBtn.addEventListener('click', () => {
        hidePopup();
        onConfirm();
    });
};


const hidePopup = () => {
    popup.style.display = 'none';
};


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
    
    
    taskInput.value = '';
    

    showPopup(
        'Success!',
        'Task has been added successfully.',
        () => {}
    );
};

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


const updateDeleteAllButton = () => {
    if (tasks.length === 0) {
        deleteAllBtn.disabled = true;
        noTasksMessage.style.display = 'block';
    } else {
        deleteAllBtn.disabled = false;
        noTasksMessage.style.display = 'none';
    }
};


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
    
   
    setTimeout(() => {
        li.classList.remove('new');
    }, 300);
    
    return li;
};


const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};


const attachEventListeners = () => {
    
    addTaskBtn.addEventListener('click', addTask);
    
   
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    
    deleteAllBtn.addEventListener('click', deleteAllTasks);
    

    cancelBtn.addEventListener('click', hidePopup);
    
  
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            hidePopup();
        }
    });
    

    taskInput.addEventListener('input', () => {
        if (errorMessage.classList.contains('show')) {
            hideErrorMessage();
        }
    });
};


const showSuccessMessage = (message) => {
    showPopup('Success!', message, () => {});
};


const getTaskStatistics = () => {
    return {
        total: tasks.length,
        created: tasks.filter(task => task.createdAt).length
    };
};


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


window.editTask = editTask;
window.deleteTask = deleteTask;
window.exportTasks = exportTasks;
window.importTasks = importTasks;


document.addEventListener('DOMContentLoaded', initializeApp);

