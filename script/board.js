const CONDITIONS = {
  0: 'taskToDo',
  1: 'taskProgress',
  2: 'taskAwaFeedb',
  3: 'taskDone',
}

const PRIOS = {
  0: '../img/icons/prio_low.svg',
  1: '../img/icons/prio_medium.svg',
  2: '../img/icons/prio_high.svg',
}

/**
 * Asynchronously initialization of the board.
 * 
 */
async function initBoard() {
  await init('tabboard');
  getAddTaskHTML();
  render(tasks);
}

/**
 * Deletes all task cards by clearing the HTML content of task containers.
 *
 */
function deleteAllCards() {
  document.getElementById('taskToDo').innerHTML = '';
  document.getElementById('taskProgress').innerHTML = '';
  document.getElementById('taskAwaFeedb').innerHTML = '';
  document.getElementById('taskDone').innerHTML = '';
}

/**
 * Renders task cards based on the provided array of tasks, updating the HTML content of task containers.
 *
 * @param {Array} showTasks - An array of tasks to be rendered.
 */
function render(showTasks) {
  deleteAllCards();
  let conditionsCounter = {
    'taskToDo': 0,
    'taskProgress': 0,
    'taskAwaFeedb': 0,
    'taskDone': 0,
  };
  for (let i = 0; i < showTasks.length; i++) {
    const task = showTasks[i];
    let condition = CONDITIONS[task['condit']];
    let prio = PRIOS[task['prio']];
    conditionsCounter[condition] += 1;
    const slot = document.getElementById(condition);
    slot.innerHTML += cardHTML(i, task, prio, progressHTML(showTasks, i), useresHTML(showTasks, i), getGroupColor(showTasks, i));
  }
  setEmptySlots(conditionsCounter);
}

/**
 * Retrieves the color associated with the group of a task based on the provided array of tasks and groups.
 *
 * @param {Array} showTasks - An array of tasks.
 * @param {number} index - The index of the task for which to retrieve the group color.
 * @returns {string} The color associated with the group of the task or a default color if the group is not found.
 */
function getGroupColor(showTasks, index) {
  let groupsId = findIndexByValue('name', showTasks[index]['group'], groups);
  if (groupsId >= 0) return groups[groupsId]['color']
  else return "#9797a5"
}

/**
 * Sets empty slot HTML for task containers based on the count of tasks in each condition.
 *
 * @param {Object} conditionsCounter - An object containing the count of tasks in each condition.
 */
function setEmptySlots(conditionsCounter) {
  if (conditionsCounter.taskToDo == 0) emptySlotHTML('taskToDo');
  if (conditionsCounter.taskProgress == 0) emptySlotHTML('taskProgress');
  if (conditionsCounter.taskAwaFeedb == 0) emptySlotHTML('taskAwaFeedb');
  if (conditionsCounter.taskDone == 0) emptySlotHTML('taskDone');
}

/**
 * Initiates the process of adding a new task.
 *
 * @param {string} condit - The condition in which the new task will be added.
 */
function addNewTask(condit) {
  showOvlyCard(AddTaskHTML);
  loadCategory();
  loadUser();
  loadNewCategoryInput();
  setMinDate('addTaskDueDate')
  conditNewTask = condit;
}

/**
 * Checks or unchecks subtask checkboxes based on the state of each subtask in the specified task.
 *
 * @param {number} idx - The index of the task containing subtasks.
 */
function checkSubtasks(idx) {
  let subtasks = tasks[idx].subTask;
  for (let i = 0; i < subtasks.length; i++) {
    let checkbox = document.getElementById('subTask' + i);
    (subtasks[i].state >= 1) ? checkbox.checked = true : checkbox.checked = false
  }
}

/**
 * Toggles the state of a subtask (checked or unchecked) and updates the task data in local storage.
 *
 * @param {number} TaskIdx - The index of the task containing the subtask.
 * @param {number} SubtasksIdx - The index of the subtask within the task.
 * @returns {Promise<void>} A promise that resolves after the task data is updated and tasks are rendered.
 */
async function toggleSubtask(TaskIdx, SubtasksIdx) {
  let checkbox = document.getElementById('subTask' + SubtasksIdx).checked;
  (checkbox == true) ? tasks[TaskIdx].subTask[SubtasksIdx].state = 1 : tasks[TaskIdx].subTask[SubtasksIdx].state = 0;
  setItem('tasks', tasks);
  render(tasks);
}


// ########## drag and drop  ##########

let currentDraggedElement;

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves the currently dragged element to the specified condition, updates the task data in local storage,
 * renders the tasks, and removes the highlighting from the target task container.
 *
 * @param {number} condit - The condition to which the element is moved.
 */
function moveToDrop(condit) {
  tasks[currentDraggedElement]['condit'] = condit;
  setItem('tasks', tasks);
  render(tasks);
  const condition = {
    0: 'taskToDo',
    1: 'taskProgress',
    2: 'taskAwaFeedb',
    3: 'taskDone',
  }[condit];
  document.getElementById(condition).classList.remove('taskfieldHighlight');
}

function addHighlight(id) {
  document.getElementById(id).classList.add('taskfieldHighlight');
}

function deletHighlight(id) {
  document.getElementById(id).classList.remove('taskfieldHighlight');
}

// functions for searching

/**
 * Sets the search tasks by filtering the tasks based on the search input value and renders the filtered tasks.
 *
 */
function setSerchTasks() {
  let serch = document.getElementById("search").elements["searchInp"];
  let filtertTasks = [];
  let ArrayTitle = getArrayOfIncludes('title', serch.value, tasks);
  let ArrayDesc = getArrayOfIncludes('descr', serch.value, tasks);
  let mergedArray = mergeArraysWithoutDuplicates(ArrayDesc, ArrayTitle);
  for (let i = 0; i < mergedArray.length; i++) {
    filtertTasks.push(tasks[mergedArray[i]]);
  }
  render(filtertTasks);
}

function moveTo(taskIdx, condit) {
  tasks[taskIdx]['condit'] = condit;
  setItem('tasks', tasks);
  render(tasks);
}