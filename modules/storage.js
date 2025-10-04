export const saveTasks = (tasks) => {
    try {
        localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
    }
};

export const loadTasks = () => {
    try {
        const tasks = localStorage.getItem('taskflow-tasks');
        return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        return [];
    }
};

export const generateId = () => {
    return Date.now();
};

export const filterTasks = (tasks, filter) => {
    switch (filter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
};

export const countActiveTasks = (tasks) => {
    return tasks.filter(task => !task.completed).length;
};

export const countCompletedTasks = (tasks) => {
    return tasks.filter(task => task.completed).length;
};

export const clearCompletedTasks = (tasks) => {
    return tasks.filter(task => !task.completed);
};

export const toggleAllTasks = (tasks, completed) => {
    return tasks.map(task => ({ ...task, completed }));
};

export const updateTaskText = (tasks, taskId, newText) => {
    return tasks.map(task => task.id === taskId ? { ...task, text: newText } : task);
};

export const deleteTask = (tasks, taskId) => {
    return tasks.filter(task => task.id !== taskId);
};

export const toggleTaskCompletion = (tasks, taskId) => {
    return tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
};

export const reorderTasks = (tasks, fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    return updatedTasks;
};

export const setTheme = (theme) => {
    const body = document.body;
    body.classList.remove('theme-default', 'theme-blue', 'theme-green', 'theme-purple');
    if (theme !== 'default') {
        body.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('taskflow-theme', theme);
};

export const loadTheme = () => {
    return localStorage.getItem('taskflow-theme') || 'default';
};

export const clearAllTasks = () => {
    return [];
};

export const markAllTasks = (tasks, completed) => {
    return tasks.map(task => ({ ...task, completed }));
};

export const getTaskById = (tasks, taskId) => {
    return tasks.find(task => task.id === taskId);
};

export const bulkAddTasks = (tasks, newTasks) => {
    const formattedTasks = newTasks.map(text => ({ id: generateId(), text, completed: false }));
    return [...tasks, ...formattedTasks];
};

export const editTask = (tasks, taskId, newText) => {
    return tasks.map(task => task.id === taskId ? { ...task, text: newText } : task);
};

export const clearAllData = () => {
    localStorage.removeItem('taskflow-tasks');
    localStorage.removeItem('taskflow-theme');
    localStorage.removeItem('taskflow-history');
};

// Undo/Redo system
const MAX_HISTORY = 50;
let history = [];
let historyIndex = -1;

export const saveState = (tasks) => {
    const state = JSON.stringify(tasks);
    // Remove any redo states
    history = history.slice(0, historyIndex + 1);
    history.push(state);
    if (history.length > MAX_HISTORY) {
        history.shift();
    } else {
        historyIndex++;
    }
    console.log('saveState: history length:', history.length, 'historyIndex:', historyIndex);
};

export const undo = () => {
    if (historyIndex > 0) {
        historyIndex--;
        console.log('undo: historyIndex:', historyIndex);
        return JSON.parse(history[historyIndex]);
    }
    console.log('undo: no more undo');
    return null;
};

export const redo = () => {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        console.log('redo: historyIndex:', historyIndex);
        return JSON.parse(history[historyIndex]);
    }
    console.log('redo: no more redo');
    return null;
};



export const canUndo = () => historyIndex > 0;
export const canRedo = () => historyIndex < history.length - 1;

export const loadHistory = () => {
    try {
        const savedHistory = localStorage.getItem('taskflow-history');
        if (savedHistory) {
            history = JSON.parse(savedHistory);
            historyIndex = history.length - 1;
        }
    } catch (error) {
        console.error('Error loading history:', error);
    }
};

export const saveHistory = () => {
    try {
        localStorage.setItem('taskflow-history', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving history:', error);
    }
};

export const importTasks = (json) => {
    try {
        const tasks = JSON.parse(json);
        if (Array.isArray(tasks) && tasks.every(task => task.id && task.text !== undefined && task.completed !== undefined)) {
            return tasks;
        }
        throw new Error('Invalid task format');
    } catch (error) {
        console.error('Error importing tasks:', error);
        return null;
    }
};

export const exportTasks = (tasks) => {
    return JSON.stringify(tasks, null, 2);
};
