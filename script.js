// Elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const filterButtons = document.querySelectorAll("#filters button");
const count = document.getElementById("count");
const empty = document.getElementById("empty");
const clearCompletedBtn = document.getElementById("clearCompleted");

// State
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Count
function updateCount() {
  const all = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  count.textContent = `${all} Tasks • ${completed} Completed`;
}

// Empty State
function checkEmpty() {
  empty.style.display = tasks.length ? "none" : "block";
}

// Render
function render(filter = "all") {
  list.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span class="text">${task.text}</span>
      <div class="actions">
        <button class="edit">✏️</button>
        <button class="delete">❌</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateCount();
  checkEmpty();
}

// Add Task
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return alert("Please enter a task");

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  input.value = "";
  save();
  render(currentFilter);
});

// Enter key add
input.addEventListener("keyup", e => {
  if (e.key === "Enter") addBtn.click();
});

// Event Delegation (Edit / Delete / Toggle Complete)
list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);
  const task = tasks.find(t => t.id === id);

  // Delete
  if (e.target.closest(".delete")) {
    tasks = tasks.filter(t => t.id !== id);
  }

  // Edit
  else if (e.target.classList.contains("edit")) {
    const newText = prompt("Edit task:", task.text);
    if (newText && newText.trim() !== "") {
      task.text = newText.trim();
    }
  }

  // Toggle Complete
  else {
    task.completed = !task.completed;
  }

  save();
  render(currentFilter);
});

// Filters
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    render(currentFilter);
  });
});

// Clear Completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  save();
  render(currentFilter);
});

// Initial Load
render();
