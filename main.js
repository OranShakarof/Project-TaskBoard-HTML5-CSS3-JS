"use strict";
displayTasks();

// Saving new task:
function save(event) {
  // Take DOM Elements
  const descriptionBox = document.getElementById("descriptionBox");
  const timeBox = document.getElementById("timeBox");

  // Create task Object:
  const description = descriptionBox.value;
  const time = timeBox.value;

  // Validation Task
  if (!validateTask(descriptionBox, timeBox)) {
    event.preventDefault();
    return;
  }

  //Create Task Object
  const task = { description, time };

  // Add new task and save to storage
  addTask(task);

  // Clear Boxes
  descriptionBox.value = "";
  timeBox.value = "";
  descriptionBox.focus();

  event.preventDefault();
}

function validateTask(description, time) {
  // Validation for description
  if (description.value === "") {
    alert("Missing Description");
    description.focus();
    return false;
  }
  if (description.value.length < 4) {
    alert("Description length must be at least 4 chars!");
    description.focus();
    return false;
  }

  // Validation for date and time
  if (time.value === "") {
    alert("Missing Date and Time");
    time.focus();
    return false;
  }

  const selectedTime = new Date(time.value);
  const currentTime = new Date();

  if (selectedTime <= currentTime) {
    alert("Please select a future date and time");
    time.focus();
    return false;
  }
  return true;
}

function addTask(task) {
  // Take Data from Storage
  let json = localStorage.getItem("tasks");
  const tasks = json ? JSON.parse(json) : [];

  // Add new task
  tasks.push(task);

  // Save back to Storage:
  json = JSON.stringify(tasks);
  localStorage.setItem("tasks", json);

  // Display tasks
  displayTasks();

  // Get the newly added task element
  const newTaskElement = document.querySelector(".task:last-child");

  // Apply fade-in animation
  newTaskElement.classList.add("fade-in");

  // Trigger a reflow by accessing the element's offsetHeight
  newTaskElement.offsetHeight;

  // Activate the fade-in animation
  newTaskElement.classList.add("active");
}

function displayTasks() {
  const sectionTasks = document.getElementById("sectionTasks");
  // Take Data from Storage
  const json = localStorage.getItem("tasks");
  const tasks = json ? JSON.parse(json) : [];

  let html = "";
  for (let i = 0; i < tasks.length; i++) {
    // Change the format of the Date and Time
    const { formattedDate, formattedTime } = formatDateTime(tasks[i].time);
    // Create HTML
    html += `
            <div class="task">
                <div class="noteBg">
                    <button class="remove" onclick="remove(${i})">
                    <i class="bi bi-x-square"></i>
                    </button>
                    <textarea class="note" disabled="disabled" >${tasks[i].description}</textarea>
                    <div class="date">
                        ${formattedDate}
                        <br>
                        ${formattedTime}
                    </div>
                </div>
            </div>
        `;
  }

  sectionTasks.innerHTML = html;
}

function remove(index) {
  // get array from Storage
  let json = localStorage.getItem("tasks");
  const tasks = json ? JSON.parse(json) : [];

  // remove item in given index
  tasks.splice(index, 1);
  // save back array to storage
  json = JSON.stringify(tasks);
  localStorage.setItem("tasks", json);

  // display again
  displayTasks();
}

// Change the format of the Date and Time
function formatDateTime(dateTime) {
  const taskTime = new Date(dateTime);
  const formattedDate = taskTime
    .toLocaleDateString({
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    .replace(/\./g, "/");
  const taskHours = taskTime.getHours();
  const taskMinutes = taskTime.getMinutes();
  const formattedTime = `${taskHours.toString().padStart(2, "0")}:${taskMinutes
    .toString()
    .padStart(2, "0")}`;

  return { formattedDate, formattedTime };
}
