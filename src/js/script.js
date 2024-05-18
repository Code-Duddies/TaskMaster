document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');

  document.addEventListener('keypress', handleKeyPress);

  addTaskBtn.addEventListener('click', handleAddTask);

  function handleKeyPress(event) {
    const key = event.key.toLowerCase();
    if (key == 'enter') {
      handleAddTask();
    }
  }

  function handleAddTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      addTask(taskText);
      taskInput.value = '';
    }
  }

  function addTask(taskText) {
    const li = document.createElement('li');
    li.textContent = taskText;
    taskList.appendChild(li);
    li.addEventListener('click', () => {
      li.classList.toggle('completed');
    });
    li.addEventListener('contextmenu', e => {
      e.preventDefault();
      taskList.removeChild(li);
    });
  }
});
