import { saveTasks, loadTasks, generateId, toggleTaskCompletion, deleteTask, clearCompletedTasks, markAllTasks, updateTaskText, saveState, undo, redo, canUndo, canRedo, loadHistory, saveHistory } from './modules/storage.js';
import { renderTaskList, updateTaskCounter } from './modules/render.js';
import { validateTaskText, showError, clearError } from './modules/validation.js';

let tasks = [];
let currentFilter = 'all';

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};


const performanceMetrics = {
    renderStart: 0,
    renderEnd: 0,
    logRenderTime: () => {
        const duration = performanceMetrics.renderEnd - performanceMetrics.renderStart;
        console.log(`Task list render time: ${duration.toFixed(2)}ms`);
    },
    startRender: () => {
        performanceMetrics.renderStart = performance.now();
    },
    endRender: () => {
        performanceMetrics.renderEnd = performance.now();
        performanceMetrics.logRenderTime();
    }
};


document.addEventListener('DOMContentLoaded', () => {
    tasks = loadTasks();
    loadHistory();
    if (tasks.length > 0) {
        saveState(tasks);
        saveHistory();
    }
    renderTaskList(tasks, currentFilter);
    bindEvents();
    updateUndoRedoButtons();
    initAutoTheme();
 
    window.performanceMetrics = performanceMetrics;
});


const initAutoTheme = () => {
    let currentThemeIndex = 0;
    const themes = ['default', 'blue', 'green', 'purple'];

    const changeThemeAutomatically = () => {
        const body = document.body;
 
       
        body.classList.remove('theme-blue', 'theme-green', 'theme-purple');

     
        const theme = themes[currentThemeIndex];
        if (theme !== 'default') {
            body.classList.add(`theme-${theme}`);
        }

        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    };

    
    changeThemeAutomatically();

   
    setInterval(changeThemeAutomatically, 5000);
};


const bindEvents = () => {
    const form = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const markAllCompleteBtn = document.getElementById('mark-all-complete');
    const markAllIncompleteBtn = document.getElementById('mark-all-incomplete');
    const clearCompletedBtn = document.getElementById('clear-completed');

    form.addEventListener('submit', handleAddTask);

    taskList.addEventListener('click', handleTaskAction);
    taskList.addEventListener('keydown', handleTaskKeydown);
    taskList.addEventListener('editTask', handleEditTask);

    filterButtons.forEach(btn => btn.addEventListener('click', handleFilterChange));

    undoBtn.addEventListener('click', handleUndo);
    redoBtn.addEventListener('click', handleRedo);

    markAllCompleteBtn.addEventListener('click', () => {
        tasks = markAllTasks(tasks, true);
        saveTasks(tasks);
    saveState(tasks);
    saveHistory();
    renderTaskList(tasks, currentFilter);
    });

    markAllIncompleteBtn.addEventListener('click', () => {
        tasks = markAllTasks(tasks, false);
        saveTasks(tasks);
        saveState(tasks);
        renderTaskList(tasks, currentFilter);
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = clearCompletedTasks(tasks);
        saveTasks(tasks);
        saveState(tasks);
        renderTaskList(tasks, currentFilter);
    });
};


const handleAddTask = (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const text = input.value.trim();

    const validation = validateTaskText(text);
    if (!validation.isValid) {
        showError(validation.error);
        return;
    }

    clearError();
    const newTask = { id: generateId(), text, completed: false };
    tasks.push(newTask);
    saveTasks(tasks);
    saveState(tasks);
    renderTaskList(tasks, currentFilter);
    input.value = '';
    input.focus();
};


const handleTaskAction = (e) => {
    const target = e.target;
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;

    const taskId = parseInt(taskItem.dataset.taskId);

    if (target.classList.contains('task-checkbox')) {
        tasks = toggleTaskCompletion(tasks, taskId);
        saveTasks(tasks);
        saveState(tasks);
        renderTaskList(tasks, currentFilter);
    } else if (target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = deleteTask(tasks, taskId);
            saveTasks(tasks);
            saveState(tasks);
            renderTaskList(tasks, currentFilter);
        }
    }
};


const handleTaskKeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const taskItem = e.target.closest('.task-item');
        if (taskItem) {
            const checkbox = taskItem.querySelector('.task-checkbox');
            if (checkbox) {
                checkbox.click();
            }
        }
    }
};


const handleFilterChange = (e) => {
    const filter = e.target.id.replace('filter-', '');
    currentFilter = filter;

    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    renderTaskList(tasks, currentFilter);
};

const handleEditTask = (e) => {
    const { taskId, newText } = e.detail;

    const validation = validateTaskText(newText);
    if (!validation.isValid) {
        showError(validation.error);
        return;
    }

    clearError();
    tasks = updateTaskText(tasks, taskId, newText);
    saveTasks(tasks);
    saveState(tasks);
    renderTaskList(tasks, currentFilter);
};

const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
        tasks = previousState;
        saveTasks(tasks);
       
        saveHistory();
        renderTaskList(tasks, currentFilter);
    }
    updateUndoRedoButtons();
};

const handleRedo = () => {
    console.log('Redo clicked');
    const nextState = redo();
    console.log('Redo state:', nextState);
    if (nextState) {
        tasks = nextState;
        saveTasks(tasks);
        saveState(tasks);
        saveHistory();
        renderTaskList(tasks, currentFilter);
    }
    updateUndoRedoButtons();
};

const updateUndoRedoButtons = () => {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const canUndoVal = canUndo();
    const canRedoVal = canRedo();
    console.log('updateUndoRedoButtons: canUndo:', canUndoVal, 'canRedo:', canRedoVal);
    undoBtn.disabled = !canUndoVal;
    redoBtn.disabled = !canRedoVal;
};

