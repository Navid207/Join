// contact page related templates

function getOvlyCardNewContactHTML() {
    return /*html*/`
        <div id="ovlyCardHeader">
            <img src="../img/logo.svg" alt="logo">
            <span id="ovlyCardHL">Add contact</span>
            <span id="ovlyCardST">Tasks are better with a team!</span>
            <div id="ovlyCardLine"></div>
        </div>
        <form id="wrapperCardDetails" onsubmit="return false">
            <div id="ovlUserIC">
                <img src="../img/icons/user_line-white.svg" alt="">
            </div>
            <div id="ovlyCardForm">
                <div>
                    <input id="formContactName" type="text" placeholder="Name"
                    pattern="[A-ZÄÖÜ][a-zäöüß]{1,} [A-ZÄÖÜ][a-zäöüß]{1,}"
                    title="Name Lastname" required>
                    <img src="../img/icons/user_line.svg" alt="user">
                </div>
                <div>
                    <input id="formContactEmail" type="email" placeholder="Email" 
                    required>
                    <img src="../img/icons/mail.svg" alt="letter">
                </div>
                <div>
                    <input id="formContactPhone" type="text" placeholder="Phone" 
                    pattern="[0-9+ ]{1,}"
                    title="only numbers and + sign"
                    required>
                    <img src="../img/icons/phone.svg" alt="phone">
                </div>
            </div>
            <div id="ovlywrapperBtn">
                <button id="ovlyBtnSecondary" class="but-light" type="submit" formnovalidate onclick="hideOvlyCard()">
                    <span>Cancel</span>
                    <img src="../img/icons/close.svg" alt="cross">
                </button>
                <button id="ovlyBtnPrimary" class="but-dark" type="submit" onclick="createContact()">
                    <span>Create contact</span>
                    <img src="../img/icons/check.svg" alt="check">
                </button>
            </div>
            <button id="ovlyBtnClose" formnovalidate onclick="hideOvlyCard()"></button>
        </form>
    `
}

function getOvlyCardEditContactHTML(idx) {
    let contactData = contactListSorted[idx];
    return /*html*/`
        <div id="ovlyCardHeader">
                    <img src="../img/logo.svg" alt="logo">
                    <span id="ovlyCardHL">Edit contact</span>
                    <div id="ovlyCardLine"></div>
                </div>
                <form id="wrapperCardDetails" onsubmit="return false">
                    <div id="ovlUserIC" style="background-color: ${contactData['color']}">
                        <span>${contactData['initials']}</span>
                    </div>
                    <div id="ovlyCardForm">
                        <div>
                            <input id="formContactName" type="text" placeholder="Name" value="${contactData['name']}"
                            pattern="[A-ZÄÖÜ][a-zäöüß]{1,} [A-ZÄÖÜ][a-zäöüß]{1,}"
                            title="Name Lastname" required>
                            <img src="../img/icons/user_line.svg" alt="user">
                        </div>
                        <div>
                            <input id="formContactEmail" type="email" placeholder="Email" value="${contactData['email']}" 
                            required>
                            <img src="../img/icons/mail.svg" alt="letter">
                        </div>
                        <div>
                            <input id="formContactPhone" type="text" placeholder="Phone" value="${contactData['phone']}"
                            pattern="[0-9+ ]{1,}"
                            title="only numbers and + sign"
                            required>
                            <img src="../img/icons/phone.svg" alt="phone">
                        </div>
                    </div>
                    <div id="ovlywrapperBtn">
                        <button id="ovlyBtnSecondary" class="but-light" type="submit" formnovalidate onclick="deleteContact(${idx})">
                            <span>Delete</span>
                            <img src="../img/icons/close.svg" alt="cross">
                        </button>
                        <button id="ovlyBtnPrimary" class="but-dark" type="submit" onclick="saveContact(${idx},1)">
                            <span>Save</span>
                            <img src="../img/icons/check.svg" alt="check">
                        </button>
                    </div>
                    <button id="ovlyBtnClose" formnovalidate onclick="hideOvlyCard()"></button>
                </form>
    `
}

let AddTaskHTML;
async function getAddTaskHTML() {
    let response = await fetch('../templates/addtask.html');
    AddTaskHTML = await response.text();
    AddTaskHTML = /*html*/`
        <div id="ovlyCardAddTask">
            ${AddTaskHTML}
            <button id="ovlyBtnClose" onclick="hideOvlyCard()">
                <svg viewBox="0 0 31 31" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.9616 7.65393L7.65388 22.9617" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                    <path d="M22.8172 23.1061L7.50941 7.79832" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `
}

function getContactListLetterHTML(letter) {
    return /*html*/`
        <div class="ContactlistelementLetter">
            <span class="listLetter">${letter}</span>
            <div class="line"></div>
        </div>
    `
}

function getContactListContactHTML(idx, contactData) {
    return /*html*/`
        <div id="contact${idx}" class="Contactlistelement" onclick="showContactDetails(event,'${idx}')">
            <span id="contactinitialsList${idx}" class="contactinitialsList">${contactData['initials']}</span>
            <div class="wrapperContact">
                <span id="contactNameList${idx}" class="contactnameList">${contactData['name']}</span>
                <span id="contactemailList${idx}" class="contactemailList">${contactData['email']}</span>
            </div>
        </div>
    `
}


// Board page related templates

function cardHTML(index, task, prio, progress, useres, color) {
    let cardControl = cardControlHTML(task, index);
    return /*html*/`
    <div class="card">
        <div class="cardContend" id="task${index}" draggable="true" ondragstart="startDragging(${index})" 
          onclick="showOvlyCard(getOvlyTaskHTML(${index})), checkSubtasks(${index})"> 
            <div class="group" style="background-color:${color}">${task['group']}</div>
            <h3>${task['title']}</h3>
            <p>${task['descr']}</p>
            <div id="progress${index}" class="progress">
                ${progress}
            </div>
            <div class="btm-line">
                <div id='users${index}' class="users">${useres}</div>
                <img src="${prio}" alt="prio">
            </div>
        </div>
        <div class="cardControl">                        
            ${cardControl}
        </div>
    </div>
  `
}

function cardControlHTML(task, index) {
    let svgUp = cardControlUpHTML(task, index);
    let svgDown = cardControlDownHTML(task, index);
    let svgMoveTo = /*html*/`
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z"/>
        </svg>
    `
    return svgUp + svgMoveTo + svgDown
}
function cardControlUpHTML(task, index) {
    if (task.condit > 0) {
        return/*html*/`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" onclick="moveTo(${index},${task.condit - 1})">
                <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z"/>
            </svg>
        `
    } else {
        return/*html*/`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="noControl">
            <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z"/>
        </svg>
    `
    }
}
function cardControlDownHTML(task, index) {
    if (task.condit < 3) {
        return/*html*/`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" onclick="moveTo(${index},${task.condit + 1})">
                <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
            </svg>
        `
    } else {
        return/*html*/`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="noControl">
                <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
            </svg>
    `
    }
}

function progressHTML(showTasks, i) {
    if (!showTasks[i]['subTask'].length || showTasks[i]['subTask'].length < 1) { return '' }
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

function useresHTML(showTasks, index) {
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

function getOvlyTaskHTML(idx) {
    let task = tasks[idx];
    let assignedToHTML = getAssignedToHTML(task['users'], 'withName');
    return /*html*/`
        <div id="ovlyCardTask">
            <button id="ovlyBtnClose" onclick="hideOvlyCard()">
                <svg viewBox="0 0 31 31" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.9616 7.65393L7.65388 22.9617" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                    <path d="M22.8172 23.1061L7.50941 7.79832" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            ${getGroupHTML(task['group'])}
            <span id="ovlyTaskTitle">${task['title']}</span>
            <span id="ovlyTaskDescription">${task['descr']}</span>
            <div id="ovlyTaskWrapperDueDate">
                <span><b>Due date:</b></span>
                <span>${task['deadline']}</span>
            </div>
            <div id="ovlyTaskWrapperPrio">
                <span><b>Priority:</b></span>
                ${getPriorityHTML(task['prio'])}
            </div>
            <div id="ovlyTaskWrapperAssignedTo">
                <span><b>Assigned To:</b></span>
                <div id="ovlyTaskWrapperAssignedToList">
                    ${assignedToHTML}
                </div>
            </div>
            <div id="ovlySubTask">
                ${getSubtasksHTML(task, idx)}
            </div>
            <div id="ovlyTaskWrapperBtn">
                <button class="but-light" onclick="deleteTask(${idx})">
                    <div></div>
                </button>
                <button class="but-dark" onclick="showOvlyCard(getOvlyEditTaskHTML(${idx}))">
                    <img src="../img/icons/edit-white.svg" alt="">
                </button>
            </div>
        </div>
    `
}

function getPriorityHTML(prio) {
    let prioName, prioImg, prioColor;
    if (prio == 2) {
        prioName = 'Urgent';
        prioImg = '../img/icons/Add-Task-Prio-Urgent-hover.svg';
        prioColor = '#FF3D00';
    } else if (prio == 1) {
        prioName = 'Medium';
        prioImg = '../img/icons/Add-Task-Prio-Medium-hover.svg';
        prioColor = '#FFA800';
    } else {
        prioName = 'Low';
        prioImg = '../img/icons/Add-Task-Prio-Low-hover.svg';
        prioColor = '#7AE229';
    }
    return /*html*/`
        <div id="ovlyTaskPrio" style="background-color: ${prioColor};">
            <span>${prioName}</span>
            <img src="${prioImg}" alt="">
        </div>
    `
}

function getSubtasksHTML(task, idx) {
    let HTML = '';
    if (task.subTask.length <= 0) return HTML
    else {
        Subtasks = getSubtasksListHTML(task.subTask, idx);
        HTML = /*html*/`<span><b>Subtasks:</b></span>` + Subtasks;
    }
    return HTML
}

function getSubtasksListHTML(subTasks, idx) {
    let HTML = '';
    for (let i = 0; i < subTasks.length; i++) {
        HTML += /*html*/`
        <li>
            <input type="checkbox" id="subTask${i}" onclick="toggleSubtask(${idx},${i})">
            <label for="subTask${i}">${subTasks[i].descr}</label>
    </li>
        `
    }
    return HTML
}

function getAssignedToHTML(members, includeName) {
    let member = '';
    let HTML = '';
    for (let i = 0; i < members.length; i++) {
        member = contactListSorted.filter(c => c['email'] == members[i])[0]; // email is unique
        if (includeName) {
            HTML += /*html*/`
            <div class="ovlyAssignedToElement">
                <span style="background-color: ${member['color']};">${member['initials']}</span>
                <span>${member['name']}</span>
            </div>
        `
        } else {
            HTML += /*html*/`
            <div class="ovlyAssignedToElement">
                <span style="background-color: ${member['color']};">${member['initials']}</span>
            </div>
        `
        }
    }
    return HTML;
}

function getGroupHTML(groupName) {
    let color;
    let filter = (groups.filter(g => g['name'] == groupName)[0]);
    if (filter) color = filter['color'];
    else color = '#9797a5'
    return /*html*/`
        <span style="background-color: ${color}" id="ovlyTaskGroup">${groupName}</span>
    `
}

function getOvlyEditTaskHTML(idx) {
    let task = tasks[idx];
    let assignedToHTML = getAssignedToHTML(task['users']);
    return /*html*/`
        <button id="ovlyBtnClose" onclick="hideOvlyCard()">
            <svg viewBox="0 0 31 31" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.9616 7.65393L7.65388 22.9617" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                <path d="M22.8172 23.1061L7.50941 7.79832" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
        <form id="ovlyTaskEditform" action="" onsubmit="return false">
            <div>
                <label for="editTasktaskTitle">Title</label>
                <input id="editTasktaskTitle" type="text" placeholder="Enter a title" required value="${task['title']}">
            </div>
            <div id="wrapperEditTaskDescription">
                <label for="editTasktaskDescription">Description</label>
                <textarea name="" id="editTasktaskDescription" cols="30" rows="5" placeholder="Enter a Description" required>${task['descr']}</textarea>
            </div>
            <div>
                <label for="editTasktaskDate">Due date</label>
                <input type="date" id="editTasktaskDate" required value="${task['deadline']}" onclick = "setMinDate('editTasktaskDate')">
            </div>
            <div>
                <label>Prio</label>
                <div id="editTaskwrapperPrio">
                    ${getPrioHTML(task['prio'])}
                </div>
            </div>
            <div id="ovlyEditTaskWrapperAssignedTo">
                <label>Assigned to</label>
                <div class="" id="ovlyEditTaskwrapperAssignedToHL" onclick="openDropdown(['ovlyEditTaskWrapperMemberList'])">    
                    <span>Select contacts to assign</span>
                    <img id="ovlyEditTaskwrapperAssignedToHLImg" src="../img/icons/down-arrow.png" alt=""> 
                </div>
                <div class="display-none" id="ovlyEditTaskWrapperMemberList">
                    ${getMemberListHTML(task)}
                </div>
                <div id="ovlyEditTaskWrapperAssignedToActual">
                    ${assignedToHTML}
                </div>
            </div>
            <div id="ovlyEditTaskWrapperSubTask">
                <label>Subtask</label>
                     <div id="subtaskContainer" onmouseleave="removeMsg()">
                        <input type="text" id="ovlyEditTaskSubtaskInp" placeholder="Add new subtask">
                        <img src="../img/icons/Add-Task-Subtask-Add-Icon.svg" alt=""
                            onclick="createSubtask('ovlyEditTaskSubtaskInp','ovlyEditTaskSubTaskUl')">
                    </div>
                    <p id="msgSubTask" class="d-none">Subtask missing</p>
                    <ul id="ovlyEditTaskSubTaskUl">
                        ${getEditSubtasksHTML(task.subTask)}
                    </ul>
            </div>
            <button id="ovlyEditTaskOkBtn" class="but-dark" onclick="editTask(${idx})">
                <span>OK</span>
                <img src="../img/icons/check.svg" alt="">
            </button>
        </form>
    `
}

function getPrioHTML(prio) {
    let checked = ['', '', ''];
    checked[prio] = 'checked';
    return /*html*/`
        <input id="editTaskPrioUrgent" type="radio" name="editTaskPrio" ${checked[2]} required value=2>
        <label id="editTaskPrioUrgentlabel" for="editTaskPrioUrgent">
            <span>Urgent</span>
            <div class="editTaskPrioImg" id="editTaskPrioImgUrgent"></div>
        </label>
        <input id="editTaskPrioMedium" type="radio" name="editTaskPrio" ${checked[1]} value=1>
        <label id="editTaskPrioMediumlabel" for="editTaskPrioMedium">
            <span>Medium</span>
            <div class="editTaskPrioImg" id="editTaskPrioImgMedium"></div>
        </label>
        <input id="editTaskPrioLow" type="radio" name="editTaskPrio" ${checked[0]} value=0>
        <label id="editTaskPrioLowlabel" for="editTaskPrioLow">
            <span>Low</span>
            <div class="editTaskPrioImg" id="editTaskPrioImgLow"></div>
        </label>
    `
}

function getMemberListHTML(task) {
    let HTML = '';
    for (let i = 0; i < contactListSorted.length; i++) {
        let contact = contactListSorted[i];
        let checked;
        checked = task['users'].indexOf(contact['email']) == -1 ? '' : 'checked';
        HTML += /*html*/`
            <div id="ovlyEditTaskWrapperMemberListElement">
                <label for="member${i}">${contact['name']}</label>
                <input id="member${i}" type="checkbox" value="${contact['email']}" ${checked}>
            </div>
        `
    }
    return HTML;
}

function getEditSubtasksHTML(subTask) {
    let HTML = '';
    if (subTask.length <= 0) return HTML
    for (let i = 0; i < subTask.length; i++) {
        HTML += getCreateSubtaskHTML(subTask[i].descr, i)
    }
    return HTML
}

// Add Task

function newCategoryLiHTML() {
    return /*html*/`
    <li id="newCategory" class="but-dark" onclick="newCategory()">
        <span>New category</span>
    </li>
    `;
}

function contactLiHTML(user, initials) {
    return /*html*/`
    <li class="item">
        <div class="item-user">
            <div style="background-color: ${user['color']}">${initials}</div>
            <span>${user['name']}</span>
        </div>
        <i class="fa-solid fa-check check-icon"></i>
        <span class="checkbox"></span>
    </li>
    `;
}

function contectCircleHTML(color, initials) {
    return /*html*/`
    <div style="background-color: ${color}">
        ${initials}
    </div> 
    `
}

function categoryLiHTML(group, i) {
    return /*html*/`
    <li class="item">
        <div onclick="chooseCategory('${group['name']}')">
            <span>${group['name']}</span>
            <span class = "groupDotColors" id="color${i}" ></span>
        </div>            
        <img src="../img/icons/bin.svg" alt="bin-img" onclick="deletCategory(${i})">
    </li>
    `
}

function newCategoryDotsHTML(group, i) {
    return/*html*/`
        <input type="radio" id="${group['color']}" name="newCatColor${i}" value="${group['color']}" onclick="animateDot(this.name)" />
        <label id="newCatColor${i}" class="groupDotColors" for="${group['color']}"></label>        
    `
}

function getCreateSubtaskHTML(subtask, number) {
    return /*html*/`
    <li class="subtaskWrapper" id="Subtask${number}">
        <div class="subtaskWrapperLine" onmouseover="subtaskShowEdit(${number})" onmouseout ="subtaskHideEdit(${number})">
            <span id="titleSubtask${number}" class="subtasksTitles" >${subtask}</span>
            <div class="d-none" id="editSubtask${number}">
                <!-- <svg viewBox="0 0 21 30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.87121 22.0156L7.69054 24.9405L20.3337 4.10836C20.6203 3.63622 20.4698 3.02119 19.9977 2.73465L16.8881 0.847421C16.4159 0.560878 15.8009 0.71133 15.5144 1.18347L2.87121 22.0156Z"/>
                    <path d="M2.28614 22.9793L7.10547 25.9042L2.37685 28.1891L2.28614 22.9793Z"/>
                </svg> -->
                <svg viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg" onclick="deletSubtask(${number})">
                    <path d="M3.5 18C2.95 18 2.47917 17.8042 2.0875 17.4125C1.69583 17.0208 1.5 16.55 1.5 16V3C1.21667 3 0.979167 2.90417 0.7875 2.7125C0.595833 2.52083 0.5 2.28333 0.5 2C0.5 1.71667 0.595833 1.47917 0.7875 1.2875C0.979167 1.09583 1.21667 1 1.5 1H5.5C5.5 0.716667 5.59583 0.479167 5.7875 0.2875C5.97917 0.0958333 6.21667 0 6.5 0H10.5C10.7833 0 11.0208 0.0958333 11.2125 0.2875C11.4042 0.479167 11.5 0.716667 11.5 1H15.5C15.7833 1 16.0208 1.09583 16.2125 1.2875C16.4042 1.47917 16.5 1.71667 16.5 2C16.5 2.28333 16.4042 2.52083 16.2125 2.7125C16.0208 2.90417 15.7833 3 15.5 3V16C15.5 16.55 15.3042 17.0208 14.9125 17.4125C14.5208 17.8042 14.05 18 13.5 18H3.5ZM3.5 3V16H13.5V3H3.5ZM5.5 13C5.5 13.2833 5.59583 13.5208 5.7875 13.7125C5.97917 13.9042 6.21667 14 6.5 14C6.78333 14 7.02083 13.9042 7.2125 13.7125C7.40417 13.5208 7.5 13.2833 7.5 13V6C7.5 5.71667 7.40417 5.47917 7.2125 5.2875C7.02083 5.09583 6.78333 5 6.5 5C6.21667 5 5.97917 5.09583 5.7875 5.2875C5.59583 5.47917 5.5 5.71667 5.5 6V13ZM9.5 13C9.5 13.2833 9.59583 13.5208 9.7875 13.7125C9.97917 13.9042 10.2167 14 10.5 14C10.7833 14 11.0208 13.9042 11.2125 13.7125C11.4042 13.5208 11.5 13.2833 11.5 13V6C11.5 5.71667 11.4042 5.47917 11.2125 5.2875C11.0208 5.09583 10.7833 5 10.5 5C10.2167 5 9.97917 5.09583 9.7875 5.2875C9.59583 5.47917 9.5 5.71667 9.5 6V13Z"/>
                </svg>
            </div>
        </div>
    </li>
    `;
}