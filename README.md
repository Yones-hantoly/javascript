# JavaScript Todo List Project

A modern, responsive Todo List application built with vanilla HTML, CSS, and JavaScript. This project demonstrates collaborative development with multiple contributors working on different branches.

## Features

- ✅ Add new tasks with validation
- ✅ Edit existing tasks
- ✅ Delete individual tasks
- ✅ Delete all tasks with confirmation
- ✅ Data persistence using localStorage
- ✅ Input validation and error handling
- ✅ Popup confirmations for important actions
- ✅ Responsive design for mobile and desktop
- ✅ Modern UI with smooth animations

## Project Guidelines

### JavaScript Guidelines
- **Naming Convention**: Use meaningful and descriptive names for all variables and functions
- **Function Syntax**: Use arrow functions exclusively, avoid the `function` keyword
- **Data Persistence**: Use localStorage for data persistence (no cookies)
- **Avoid Repetition**: Use reusable functions for common operations
- **Variables**: Do not use `var` in JavaScript files (use `let` and `const`)

### Input Validation Rules
- Task must not be empty
- Task must not start with a number
- Task must be at least 5 characters long
- Display clear error messages for invalid inputs

### Error Handling
- Display error message if trying to delete when no tasks are present
- Disable delete button when no tasks exist
- Show appropriate error messages for invalid inputs

### Popup Requirements
- Confirmation popups for delete operations
- Success popups for completed actions
- Cancel functionality for all popups

## File Structure

```
js-todo-list-project/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## Development Team

This project was developed collaboratively by 3 students:

- **Student 1**: HTML structure and semantic markup
- **Student 2**: JavaScript functionality and logic
- **Student 3**: CSS styling and responsive design

## Git Workflow

- Each student worked on their own branch
- Minimum 30 commits per student branch
- All branches merged to main branch
- Main branch contains 60+ commits total

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- localStorage API
- Git for version control

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Installation and Usage

1. Clone the repository
2. Open `index.html` in a web browser
3. Start managing your tasks!

## Features in Detail

### Task Management
- Add tasks with the input field and "Add new task" button
- Edit tasks by clicking the "Edit" button
- Delete individual tasks with confirmation popup
- Delete all tasks with bulk delete functionality

### Data Persistence
- All tasks are automatically saved to localStorage
- Tasks persist between browser sessions
- No server or database required

### Responsive Design
- Mobile-first approach
- Optimized for tablets and desktops
- Touch-friendly interface
- Accessible design principles

## Contributing

This project follows collaborative development practices:
1. Create feature branches for new functionality
2. Make frequent, meaningful commits
3. Write descriptive commit messages
4. Test thoroughly before merging
5. Follow the established coding guidelines

## License

This project is for educational purposes as part of a JavaScript development course.

