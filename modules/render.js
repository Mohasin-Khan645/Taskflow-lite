import { filterTasks } from './storage.js';

export const renderTaskList = (tasks, filter = 'all') => {
    
    if (window.performanceMetrics) {
        window.performanceMetrics.startRender();
    }

    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const filteredTasks = filterTasks(tasks, filter);

    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        taskList.style.display = 'none';
        updateTaskCounter(tasks);
        
        if (window.performanceMetrics) {
            window.performanceMetrics.endRender();
        }
        return;
    }

    emptyState.style.display = 'none';
    taskList.style.display = 'block';

    
    if (filteredTasks.length > 50) {
        renderVirtualList(filteredTasks, taskList);
    } else {
        filteredTasks.forEach(task => {
            const taskItem = createTaskElement(task);
            taskList.appendChild(taskItem);
        });
    }

    updateTaskCounter(tasks);

    
    if (window.performanceMetrics) {
        window.performanceMetrics.endRender();
    }
};

const renderVirtualList = (tasks, container) => {
    const viewportHeight = 400; 
    const itemHeight = 60; 
    const visibleItems = Math.ceil(viewportHeight / itemHeight) + 5;
    let startIndex = 0;

    const updateVisibleItems = () => {
        container.innerHTML = '';
        const endIndex = Math.min(startIndex + visibleItems, tasks.length);
        for (let i = startIndex; i < endIndex; i++) {
            const taskItem = createTaskElement(tasks[i]);
            container.appendChild(taskItem);
        }
    };

    updateVisibleItems();

    
    container.addEventListener('scroll', () => {
        const scrollTop = container.scrollTop;
        startIndex = Math.floor(scrollTop / itemHeight);
        updateVisibleItems();
    });
};

const createTaskElement = (task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-task-id', task.id);
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'task-checkbox';
    checkbox.setAttribute('aria-label', `Toggle ${task.text}`);

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;
    textSpan.setAttribute('aria-label', `Task: ${task.text}`);

    textSpan.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'task-edit-input';
        input.maxLength = 100;

        li.replaceChild(input, textSpan);
        input.focus();
        input.select();

        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== task.text) {
                const event = new CustomEvent('editTask', { detail: { taskId: task.id, newText } });
                li.dispatchEvent(event);
            }
            li.replaceChild(textSpan, input);
            textSpan.textContent = newText || task.text;
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                li.replaceChild(textSpan, input);
            }
        });
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.setAttribute('aria-label', `Delete ${task.text}`);

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);

    return li;
};

export const updateTaskCounter = (tasks) => {
    const counter = document.getElementById('task-counter');
    const activeTasks = tasks.filter(task => !task.completed).length;
    counter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} remaining`;
};
