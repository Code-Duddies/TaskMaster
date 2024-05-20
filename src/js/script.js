document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const taskItem = createTaskItem(taskText);
        taskList.appendChild(taskItem);
        taskInput.value = '';

        saveTasks();
    }

    function createTaskItem(taskText, subtasks = [], expanded = true) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');

        taskItem.innerHTML = `
            <div class="task-controls">
                <span>${taskText}</span>
                <button class="collapse-btn">-</button>
                <button class="delete-task-btn">&times;</button>
            </div>
            <div class="subtask-container show">
                <div class="subtask-input">
                    <input type="text" placeholder="Add a new subtask...">
                    <button>Add Subtask</button>
                </div>
                <ul class="subtask-list"></ul>
            </div>
        `;

        const deleteTaskBtn = taskItem.querySelector('.delete-task-btn');
        const collapseBtn = taskItem.querySelector('.collapse-btn');
        const subtaskInput = taskItem.querySelector('.subtask-input input');
        const addSubtaskBtn = taskItem.querySelector('.subtask-input button');
        const subtaskList = taskItem.querySelector('.subtask-list');
        const subtaskContainer = taskItem.querySelector('.subtask-container');

        deleteTaskBtn.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
        });
        collapseBtn.addEventListener('click', () => toggleSubtasks(collapseBtn, subtaskContainer));

        if (!expanded) {
            subtaskContainer.classList.remove('show');
            collapseBtn.textContent = '+';
        }

        addSubtaskBtn.addEventListener('click', () => {
            addSubtask(subtaskInput, subtaskList);
            saveTasks();
        });

        subtaskInput.addEventListener('keydown', function(event) {
            if (event.key === "Enter") {
                addSubtask(subtaskInput, subtaskList);
                saveTasks();
            }
        });

        // Load existing subtasks if provided
        subtasks.forEach(subtaskText => {
            const subtaskItem = createSubtaskItem(subtaskText);
            subtaskList.appendChild(subtaskItem);
        });

        return taskItem;
    }

    function toggleSubtasks(collapseBtn, subtaskContainer) {
        if (subtaskContainer.classList.contains('show')) {
            subtaskContainer.classList.remove('show');
            collapseBtn.textContent = '+';
        } else {
            subtaskContainer.classList.add('show');
            collapseBtn.textContent = '-';
        }
    }

    function addSubtask(subtaskInput, subtaskList) {
        const subtaskText = subtaskInput.value.trim();
        if (subtaskText === '') return;

        const subtaskItem = createSubtaskItem(subtaskText);
        subtaskList.appendChild(subtaskItem);
        subtaskInput.value = '';

        saveTasks();
    }

    function createSubtaskItem(subtaskText) {
        const subtaskItem = document.createElement('li');
        subtaskItem.classList.add('subtask-item');
        subtaskItem.innerHTML = `
            <span>${subtaskText}</span>
            <button class="delete-subtask-btn">&times;</button>
        `;

        const deleteSubtaskBtn = subtaskItem.querySelector('.delete-subtask-btn');
        deleteSubtaskBtn.addEventListener('click', () => {
            subtaskItem.remove();
            saveTasks();
        });

        return subtaskItem;
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('.task-item').forEach(taskItem => {
            const taskText = taskItem.querySelector('.task-controls span').textContent;
            const subtasks = [];
            taskItem.querySelectorAll('.subtask-item').forEach(subtaskItem => {
                subtasks.push(subtaskItem.querySelector('span').textContent);
            });
            const expanded = taskItem.querySelector('.subtask-container').classList.contains('show');
            tasks.push({ taskText, subtasks, expanded });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.taskText, task.subtasks, task.expanded);
            taskList.appendChild(taskItem);
        });
    }
});
