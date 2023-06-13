const form = document.querySelector('form');
const newTaskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');

// Function to fetch tasks from the server
function fetchTasks() {
  fetch('https://dummyjson.com/docs/todos')
    .then(response => response.json())
    .then(data => {
      data.forEach(task => {
        createTaskElement(task);
      });
    })
    .catch(error => console.error(error));
}

// Fetch tasks on page load
fetchTasks();

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = newTaskInput.value.trim();
  if (name) {
    const task = { name, completed: false };

    // Send POST request to add a new task
    fetch('https://dummyjson.com/docs/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
      .then(response => response.json())
      .then(data => {
        createTaskElement(data);
        newTaskInput.value = '';
      })
      .catch(error => console.error(error));
  }
});

taskList.addEventListener('click', event => {
  const button = event.target;
  if (button.className === 'delete-task') {
    const li = button.parentNode;
    const taskId = li.dataset.taskId;

    // Send DELETE request to delete a task
    fetch(`https://dummyjson.com/docs/todos/${taskId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          li.remove();
        }
      })
      .catch(error => console.error(error));
  }
});

taskList.addEventListener('change', event => {
  const checkbox = event.target;
  const li = checkbox.parentNode;
  const taskId = li.dataset.taskId;
  const completed = checkbox.checked;

  // Send PATCH request to update task completion status
  fetch(`https://dummyjson.com/docs/todos/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
  })
    .then(response => {
      if (response.ok) {
        li.classList.toggle('completed', completed);
      }
    })
    .catch(error => console.error(error));
});

function createTaskElement(task) {
  const li = document.createElement('li');
  li.dataset.taskId = task.id;
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed;
  const span = document.createElement('span');
  span.className = 'task-name';
  span.textContent = task.name;
  const button = document.createElement('button');
  button.className = 'delete-task';
  button.textContent = 'Delete';
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(button);
  li.classList.toggle('completed', task.completed);
  taskList.appendChild(li);
}
