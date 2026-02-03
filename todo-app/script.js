const STORAGE_KEY = "todo-app-tasks";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

let tasks = loadTasks();
render();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = '<li class="empty-msg">No tasks yet. Add one above.</li>';
    return;
  }

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (task.done ? " done" : "");
    li.setAttribute("data-index", index);

    const check = document.createElement("button");
    check.type = "button";
    check.className = "todo-check";
    check.setAttribute("aria-label", task.done ? "Mark not done" : "Mark done");
    check.addEventListener("click", () => toggle(index));

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = task.text;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "todo-delete";
    del.textContent = "Delete";
    del.addEventListener("click", () => remove(index));

    li.append(check, span, del);
    list.appendChild(li);
  });
}

function add(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  tasks.push({ text: trimmed, done: false });
  saveTasks();
  render();
  input.value = "";
  input.focus();
}

function toggle(index) {
  if (index < 0 || index >= tasks.length) return;
  tasks[index].done = !tasks[index].done;
  saveTasks();
  render();
}

function remove(index) {
  if (index < 0 || index >= tasks.length) return;
  tasks.splice(index, 1);
  saveTasks();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  add(input.value);
});
