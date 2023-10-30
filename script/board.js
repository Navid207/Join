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
    document.getElementById(condition).innerHTML += cardHTML(i, task, prio, progressHTML(showTasks,i), useresHTML(showTasks,i), getGroupColor(showTasks,i));
  }
}

function cardHTML(index, task, prio, progress, useres, color) { // drag(event)
  return /*html*/`
    <div class="card" id="task${index}" draggable="true" ondragstart="startDragging(${index})" onclick="showOvlyCard(getOvlyTaskHTML(${index}))" oncontextmenu="ContectMoveTo()">
      <div class="group" style="background-color:${color}">${task['group']}</div>
      <h3>${task['title']}</h3>
      <p>${task['descr']}</p>
      <div id="progress${index}" class="progress">
        ${progress}
      </div>
      <div class="btm-line">
        <div id='users${index}'>${useres}</div>
        <img src="${prio}" alt="prio">
      </div>
     </div>
`
}

function progressHTML(showTasks,i) {
  if (!showTasks[i]['subTask'].length || showTasks[i]['subTask'].length <= 1) { return '' }
  const subTask = showTasks[i]['subTask'];
  let done = 0;
  for (let i = 0; i < subTask.length; i++) {
    if (subTask[i]['state'] == 1) { done++ }
  }
  let progress = 100 / subTask.length * done;
  return/*html*/`
      <div><div style="width: ${progress}%"></div></div>
      <span>${done}/${subTask.length} Done</span> 
  `
}

function getGroupColor(showTasks,index) {
  let groupsId = findIndexByValue('name', showTasks[index]['group'], groups);
  return groups[groupsId]['color']
}

function useresHTML(showTasks,index) {
  let html = ``;
  for (let i = 0; i < showTasks[index]['users'].length; i++) {
    if (showTasks[index]['users'].length <= 3 || i < 2) {
      let userId = findIndexByValue('email', showTasks[index]['users'][i], contactListSorted);
      let initials = contactListSorted[userId]['initials'];
      let color = contactListSorted[userId]['color'];
      html +=/*html*/`
      <div style="background-color:${color}">${initials}</div>    
    `
    } else {
      let leftUsers = showTasks[index]['users'].length + 1 - i;
      html +=/*html*/`
      <div style="background-color:#2A3647">+${leftUsers}</div>    
    `
      return html
    }
  }
  return html
}

// function findIndexByValue(ValueToSearch, valueToFind, dataArray) {
//   for (let i = 0; i < dataArray.length; i++) {
//     if (dataArray[i][ValueToSearch] == valueToFind) {
//       return i;
//     }
//   }
//   return -1; // Wenn die Emailadresse nicht gefunden wurde, wird -1 zurückgegeben
// }


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
  let filtertTasks=[];
  let ArrayTitle = getArrayOfIncludes('title', serch.value, tasks);
  let ArrayDesc = getArrayOfIncludes('descr', serch.value, tasks);
  let mergedArray = mergeArraysWithoutDuplicates(ArrayDesc, ArrayTitle);
  for (let i = 0; i < mergedArray.length; i++) {
    filtertTasks.push(tasks[mergedArray[i]]);
  }
  render(filtertTasks);
  //VisibilTasks=filtertTasks;
}
function getArrayOfIncludes(ValueToSearch, valueToFind, dataArray) {
  let Indexs=[];
  for (let i = 0; i < dataArray.length; i++) {
    let toSearch = dataArray[i][ValueToSearch].toLowerCase();
    let toFind = valueToFind.toLowerCase();
    if (toSearch.includes(toFind)) {
      Indexs.push(i);
    }
  }
  return Indexs;
}
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
async function editTask(idx){
  tasks[idx]['title'] = document.getElementById('editTasktaskTitle').value;
  tasks[idx]['descr'] = document.getElementById('editTasktaskDescription').value;
  tasks[idx]['deadline'] = document.getElementById('editTasktaskDate').value;
  tasks[idx]['prio'] = document.querySelector("#ovlyCard input[type='radio']:checked").value;
  tasks[idx]['users'] = getSelectedMembers();
  await setItem('tasks',tasks);
  hideOvlyCard();
  render(tasks);
}


async function deleteTask(idx){
  tasks.splice(idx,1);
  await setItem('tasks',tasks);
  hideOvlyCard();
  render(tasks);
}


function showOvlyContactAdded(){
  document.getElementById('ovlyTaskaddedToBoard').classList.add("addAnimtaion");
        setTimeout(function(){document.getElementById('ovlyTaskaddedToBoard').classList.remove("addAnimtaion")},2000);
}

function getSelectedMembers(){
  let selectedUsers = document.querySelectorAll('#ovlyEditTaskWrapperMemberList input[type="checkbox"]:checked');
  let members = [];
  for (let i = 0; i < selectedUsers.length; i++) {
      members.push(selectedUsers[i].value)  
  }
  return members;
}

function openDropdown(ID){
  showElement(ID, '');
  document.getElementById('ovlyEditTaskwrapperAssignedToHL').classList.add('styleOpen');
  document.getElementById('ovlyEditTaskwrapperAssignedToHLImg').classList.add('styleOpen');
  document.getElementById('ovlyEditTaskwrapperAssignedToHL').setAttribute('onclick','closeDropdown(["ovlyEditTaskWrapperMemberList"])');
}

function closeDropdown(ID) {
  hideElement(ID,'');
  document.getElementById('ovlyEditTaskwrapperAssignedToHL').classList.remove('styleOpen');
  document.getElementById('ovlyEditTaskwrapperAssignedToHLImg').classList.remove('styleOpen');
  document.getElementById('ovlyEditTaskwrapperAssignedToHL').setAttribute('onclick','openDropdown(["ovlyEditTaskWrapperMemberList"])');
}

// for moving tasks whith touchscreen
function ContectMoveTo() {
  //debugger  
}