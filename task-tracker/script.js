document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    document.getElementById("add-task-button").addEventListener("click", addTask);
    
    const deleteBtn = document.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', deleteAllData);
    
    document.getElementById("sort-options").addEventListener("change", sortTasks);
});

function addTask() {
    const taskInput = document.getElementById("task-input");
    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    const task = createTaskElement(taskText);
    document.getElementById("todo").appendChild(task);
    saveTasks();
    taskInput.value = "";
}

function createTaskElement(text) {
    const task = document.createElement("div");
    task.className = "task";
    task.draggable = true;
    task.textContent = text;

    task.id = `task-${Date.now()}`;

    task.addEventListener("dragstart", drag);
    task.addEventListener("dblclick", () => editTask(task));
    return task;
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("taskId", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    const task = document.getElementById(taskId);

    event.target.appendChild(task);
    saveTasks();
}

function saveTasks() {
    const columns = ["todo", "in-progress", "done"];
    const tasks = {};

    columns.forEach(columnId => {
        tasks[columnId] = Array.from(document.getElementById(columnId).getElementsByClassName("task")).map(task => task.textContent);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!tasks) return;

    Object.keys(tasks).forEach(columnId => {
        tasks[columnId].forEach(taskText => {
            const task = createTaskElement(taskText);
            document.getElementById(columnId).appendChild(task);
        });
    });
}

function editTask(task) {
    const newText = prompt("Редагувати завдання:", task.textContent);
    if (newText && newText.trim() !== "") {
        task.textContent = newText;
        saveTasks();
    }
}

function sortTasks() {
    const todoColumn = document.getElementById("todo");
    const tasks = Array.from(todoColumn.getElementsByClassName("task"));
    const sortOption = document.getElementById("sort-options").value;

    tasks.sort((a, b) => {
        if (sortOption === "alphabetical") {
            return a.textContent.localeCompare(b.textContent);  
        } else {
            return tasks.indexOf(a) - tasks.indexOf(b);  
        }
    });

    tasks.forEach(task => todoColumn.appendChild(task));

    saveTasks();
}

function deleteAllData() {
    const columns = ["todo", "in-progress", "done"];
    
    columns.forEach(columnId => {
        const column = document.getElementById(columnId);
        Array.from(column.getElementsByClassName("task")).forEach(task => task.remove());
    });

    localStorage.removeItem("tasks");
}

