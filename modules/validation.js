export const validateTaskText = (text) => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
        return { isValid: false, error: 'Task cannot be empty.' };
    }
    if (trimmed.length > 100) {
        return { isValid: false, error: 'Task must be 100 characters or less.' };
    }
    return { isValid: true, error: '' };
};

export const showError = (message) => {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
};

export const clearError = () => {
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';
};
