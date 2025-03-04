// Full Todo List App (JavaScript) with Dark Mode 🌑 and Filter Tasks 🔥

let inputBox = document.querySelector("#inputBox");
let add = document.querySelector("#add_btn");
let ul = document.querySelector("#taskList");
let clear = document.querySelector("#clear");
let filterBtns = document.querySelectorAll(".filter-btn");
let darkModeBtn = document.querySelector("#darkModeBtn");
let tasks = [];

add.addEventListener("click", function () {
  let userValue = inputBox.value;
  if (userValue.trim() !== "") {
    let task = {
      id: Date.now(),
      title: userValue,
      completed: false,
    };

    tasks.push(task);
    createTaskElement(task);
    saveToLocalStorage();
    inputBox.value = "";
    showAlert("Task Added!", "success");
  } else {
    showAlert("Please enter a task!", "error");
  }
});

inputBox.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    add.click();
  }
});

clear.addEventListener("click", function () {
  let confirmClear = confirm("Are you sure to clear all tasks?");
  if (confirmClear) {
    ul.innerHTML = "";
    tasks = [];
    localStorage.removeItem("tasks");
    showAlert("All Tasks Deleted!", "error");
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    let filter = btn.dataset.filter;
    filterTasks(filter);
    showAlert(`Filtered: ${filter}`, "info");
  });
});

darkModeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  container.classList.toggle("dark-mode");
  showAlert("Dark Mode Toggled!", "info");
});

function createTaskElement(task) {
  let li = document.createElement("li");
  li.textContent = task.title;

  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete");
  li.appendChild(deleteBtn);
  ul.appendChild(li);

  if (task.completed) {
    li.classList.add("completed");
  }

  li.addEventListener("click", function () {
    li.classList.toggle("completed");
    toggleComplete(task.id);
  });

  deleteBtn.addEventListener("click", function () {
    li.remove();
    tasks = tasks.filter((t) => t.id !== task.id);
    saveToLocalStorage();
    showAlert("Task Deleted!", "error");
  });

  li.addEventListener("dblclick", function () {
    let newTask = prompt("Edit Task:", task.title);
    if (newTask) {
      tasks = tasks.map((t) => (t.id === task.id ? { ...t, title: newTask } : t));
      li.textContent = newTask;
      li.appendChild(deleteBtn);
      saveToLocalStorage();
      showAlert("Task Updated!", "success");
    }
  });
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleComplete(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
    return task;
  });
  saveToLocalStorage();
}

function loadTasks() {
  let savedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (savedTasks) {
    tasks = savedTasks;
    tasks.forEach((task) => createTaskElement(task));
  }
}

function filterTasks(filter) {
  ul.innerHTML = "";
  let filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "uncompleted") return !task.completed;
  });
  filteredTasks.forEach((task) => createTaskElement(task));
}

function showAlert(message, type) {
  let alert = document.createElement("div");
  alert.textContent = message;
  alert.className = `alert ${type}`;
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 2000);
}

loadTasks();
