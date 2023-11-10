// let VisibilTasks = tasks;

async function initBoard() {
  await init('tabboard');
  getAddTaskHTML();
  render(tasks);
}

function deleteAllCards() {
  document.getElementById('taskToDo').innerHTML = '';
  document.getElementById('taskProgress').innerHTML = '';
  document.getElementById('taskAwaFeedb').innerHTML = '';
  document.getElementById('taskDone').innerHTML = '';
}

function render(showTasks) {
  deleteAllCards();
  for (let i = 0; i < showTasks.length; i++) {
    const task = showTasks[i];
    const condition = {
      0: 'taskToDo',
      1: 'taskProgress',
      2: 'taskAwaFeedb',
      3: 'taskDone',
    }[task['condit']];
    const prio = {
      0: '../img/icons/prio_low.svg',
      1: '../img/icons/prio_medium.svg',
      2: '../img/icons/prio_high.svg',
    }[task['prio']];
    const slot = document.getElementById(condition);
    slot.innerHTML += cardHTML(i, task, prio, progressHTML(showTasks, i), useresHTML(showTasks, i), getGroupColor(showTasks, i));
  }
}

function getGroupColor(showTasks, index) {
  let groupsId = findIndexByValue('name', showTasks[index]['group'], groups);
  if (groupsId >= 0) return groups[groupsId]['color']
  else return "#9797a5"
}

function findIndexByValue(ValueToSearch, valueToFind, dataArray) {
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i][ValueToSearch] == valueToFind) {
      return i;
    }
  }
  return -1; // Wenn die Emailadresse nicht gefunden wurde, wird -1 zurückgegeben
}

function addNewTask(condit) {
  showOvlyCard(AddTaskHTML);
  loadCategory();
  loadUser();
  loadNewCategoryInput();
  setMinDate('addTaskDueDate')
  conditNewTask = condit;
}

function checkSubtasks(idx) {
  let subtasks = tasks[idx].subTask;
  for (let i = 0; i < subtasks.length; i++) {
    let checkbox = document.getElementById('subTask' + i);
    (subtasks[i].state >= 1) ? checkbox.checked = true : checkbox.checked = false
  }
}

async function toggleSubtask(TaskIdx,SubtasksIdx){
  let checkbox = document.getElementById('subTask' + SubtasksIdx).checked;
  (checkbox == true) ? tasks[TaskIdx].subTask[SubtasksIdx].state = 1 : tasks[TaskIdx].subTask[SubtasksIdx].state = 0;
  setItem('tasks', tasks);
  render(tasks);
}


// drag and drop  
let currentDraggedElement;

function startDragging(id) {
  currentDraggedElement = id;
}
function allowDrop(ev) {
  ev.preventDefault();
}
function moveTo(condit) {
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
  //VisibilTasks=filtertTasks;
}
// function getArrayOfIncludes(ValueToSearch, valueToFind, dataArray) {
//   let Indexs=[];
//   for (let i = 0; i < dataArray.length; i++) {
//     let toSearch = dataArray[i][ValueToSearch].toLowerCase();
//     let toFind = valueToFind.toLowerCase();
//     if (toSearch.includes(toFind)) {
//       Indexs.push(i);
//     }
//   }
//   return Indexs;
// }

function mergeArraysWithoutDuplicates(arr1, arr2) {
  const mergedArray = arr1;
  for (let i = 0; i < arr2.length; i++) {
    if (!mergedArray.includes(arr2[i])) {
      mergedArray.push(arr2[i]);
    }
  }
  return mergedArray;
}

// overlay related functions
async function editTask(idx) {
  tasks[idx]['title'] = document.getElementById('editTasktaskTitle').value;
  tasks[idx]['descr'] = document.getElementById('editTasktaskDescription').value;
  tasks[idx]['deadline'] = document.getElementById('editTasktaskDate').value;
  tasks[idx]['prio'] = document.querySelector("#ovlyCard input[type='radio']:checked").value;
  tasks[idx]['users'] = getSelectedMembers();
  await setItem('tasks', tasks);
  hideOvlyCard();
  render(tasks);
}


async function deleteTask(idx) {
  tasks.splice(idx, 1);
  await setItem('tasks', tasks);
  hideOvlyCard();
  render(tasks);
}


function showOvlyContactAdded() {
  document.getElementById('ovlyTaskaddedToBoard').classList.add("addAnimtaion");
  setTimeout(function () { document.getElementById('ovlyTaskaddedToBoard').classList.remove("addAnimtaion") }, 2000);
}

function getSelectedMembers() {
  let selectedUsers = document.querySelectorAll('#ovlyEditTaskWrapperMemberList input[type="checkbox"]:checked');
  let members = [];
  for (let i = 0; i < selectedUsers.length; i++) {
    members.push(selectedUsers[i].value)
  }
  return members;
}

function openDropdown(ID) {
  showElement(ID, '');
  document.getElementById('ovlyEditTaskwrapperAssignedToHL').classList.add('styleOpen');
  document.getElementById('ovlyEditTaskwrapperAssignedToHLImg').classList.add('styleOpen');
  document.getElementById('ovlyEditTaskwrapperAssignedToHL').setAttribute('onclick', 'closeDropdown(["ovlyEditTaskWrapperMemberList"])');
}

function closeDropdown(ID) {
  hideElement(ID, '');
  document.getElementById('ovlyEditTaskwrapperAssignedToHL').classList.remove('styleOpen');
  document.getElementById('ovlyEditTaskwrapperAssignedToHLImg').classList.remove('styleOpen');
  document.getElementById('ovlyEditTaskwrapperAssignedToHL').setAttribute('onclick', 'openDropdown(["ovlyEditTaskWrapperMemberList"])');
}

// for moving tasks whith touchscreen
function ContectMoveTo() {
  //debugger  
}