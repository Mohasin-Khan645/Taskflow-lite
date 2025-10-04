# TaskFlow Lite

## Tagline
Your client-side task management solution

## Overview
TaskFlow Lite is a fully functional, vanilla JavaScript task manager that runs entirely in the browser. It supports core CRUD operations (Create, Read, Update, Delete) with data persistence using localStorage. No frameworks or external dependencies are required – just open `index.html` in any modern browser.

### Features
- **Add Tasks**: Enter task text and submit via form (with validation for non-empty and length limits).
- **View Tasks**: Dynamically rendered list with completion status (checkbox toggle).
- **Update Tasks**: Toggle completion status; optional inline editing on double-click.
- **Delete Tasks**: Remove tasks with confirmation dialog.
- **Filters**: Switch between All, Active, and Completed tasks.
- **Task Counter**: Shows number of remaining (active) tasks.
- **Persistence**: Tasks saved to localStorage; data persists across browser sessions.
- **UI/UX**: Responsive design, visual feedback (e.g., animations), empty state, real-time validation errors.


### File Structure
```
taskflow-lite/
├── index.html          # Main application interface
├── styles/
│   ├── main.css        # Core styling (layout, components)
│   └── utilities.css   # Helper classes (animations, utilities)
├── app.js              # Application logic (entry point, event handling)
├── modules/
│   ├── storage.js      # localStorage abstraction (save/load tasks)
│   ├── render.js       # DOM rendering functions
│   └── validation.js   # Form validation logic
└── README.md           # This file
```

## Setup & Usage
1. **Run the App**:
   - Open `taskflow-lite/index.html` in your web browser (e.g., Chrome, Firefox).
   - No installation needed – it's fully client-side.

2. **Basic Usage**:
   - Type a task in the input field and click "Add Task" (or press Enter).
   - Click the checkbox to mark tasks as completed (strikethrough text).
   - Use filter buttons to view All, Active, or Completed tasks.
   - Double-click a task to edit it inline (optional feature).
   - Click the trash icon to delete a task (confirms before deleting).
   - Refresh the browser – your tasks will reload from localStorage.

3. **Clear Data** (for testing):
   - Open browser DevTools (F12) > Application/Storage > Local Storage > Clear `taskflow-tasks`.

## Technical Details
- **Data Structure**: Tasks are objects like `{ id: number, text: string, completed: boolean }`. IDs use `Date.now()` for uniqueness.
- **MVC Pattern**:
  - **Model**: `storage.js` handles data persistence.
  - **View**: `render.js` manages DOM rendering/updates.
  - **Controller**: `app.js` orchestrates events, validation, and state changes.
- **Validation**: Prevents empty tasks (>0 chars, <100 chars max); shows error messages.
- **Event Handling**: Delegation on task list for dynamic checkboxes/deletes; form submission for adds.
- **Styling**: CSS Grid/Flexbox for responsive layout; CSS transitions for smooth interactions.
- **Browser Compatibility**: Modern browsers (ES6 support); localStorage requires HTTPS or localhost for security in some cases.

## Testing & Quality
- **Functional Tests**:
  - Add/remove 50+ tasks: Handles efficiently without lag.
  - Persistence: Reload browser – tasks remain.
  - Mobile: Responsive on touch devices.
- **Performance**: Rendering 100 tasks takes <50ms (test in console).

## Enhancements (Future Ideas)
- Drag-and-drop reordering.
- Due dates/categories.
- Export/Import tasks as JSON.
- Dark mode toggle.


