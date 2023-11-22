// board page for a task overlay related templates

/**
 * Generates HTML markup for the task overlay, displaying detailed information about a task.
 *
 * @param {number} idx - The index of the task in the tasks array.
 * @returns {string} The HTML markup for the task overlay.
 */
function getOvlyTaskHTML(idx) {
    let task = tasks[idx];
    let assignedToHTML = getAssignedToHTML(task['users'], 'withName');
    return /*html*/`
    <div class="ovlyTask">
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
    </div>
    `
}

/**
 * Generates HTML markup for displaying the priority of a task.
 *
 * @param {number} prio - The priority level of the task (0 for Low, 1 for Medium, 2 for Urgent).
 * @returns {string} The HTML markup for the task priority display.
 */
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

/**
 * Generates HTML markup for displaying the subtasks of a task.
 *
 * @param {Object} task - The task object containing subtasks.
 * @param {number} idx - The index of the task in the tasks array.
 * @returns {string} The HTML markup for displaying subtasks.
 */
function getSubtasksHTML(task, idx) {
    let HTML = '';
    if (task.subTask.length <= 0) return HTML
    else {
        Subtasks = getSubtasksListHTML(task.subTask, idx);
        HTML = /*html*/`
        <span><b>Subtasks:</b></span>
        <ul>` + Subtasks + `</ul>`;
    }
    return HTML
}

/**
 * Generates HTML markup for displaying a list of subtasks.
 *
 * @param {Object[]} subTasks - An array of subtask objects.
 * @param {number} idx - The index of the task in the tasks array.
 * @returns {string} The HTML markup for displaying the list of subtasks.
 */
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

/**
 * Generates HTML markup for displaying assigned members.
 *
 * @param {string[]} members - An array of member email addresses.
 * @param {boolean} [includeName=false] - Whether to include member names in the HTML markup.
 * @returns {string} The HTML markup for displaying assigned members.
 */
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

/**
 * Generates HTML markup for displaying the group of a task.
 *
 * @param {string} groupName - The name of the group.
 * @returns {string} The HTML markup for displaying the task group.
 */
function getGroupHTML(groupName) {
    let color;
    let filter = (groups.filter(g => g['name'] == groupName)[0]);
    if (filter) color = filter['color'];
    else color = '#9797a5'
    return /*html*/`
        <span style="background-color: ${color}" id="ovlyTaskGroup">${groupName}</span>
    `
}

/**
 * Generates HTML markup for displaying the overlay for editing a task.
 *
 * @param {number} idx - The index of the task to be edited.
 * @returns {string} The HTML markup for the task editing overlay.
 */
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
        <div class="ovlyTaskEdit" onclick="closeLists()">
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
        </div>
    `
}

/**
 * Generates HTML markup for displaying task priority options in the task editing overlay.
 *
 * @param {number} prio - The priority value of the task (0, 1, or 2).
 * @returns {string} The HTML markup for task priority options.
 */
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

/**
 * Generates HTML markup for displaying a list of members in the task editing overlay.
 *
 * @param {Object} task - The task object containing information about assigned users.
 * @returns {string} The HTML markup for the list of members.
 */
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

/**
 * Generates HTML markup for displaying a list of subtasks in the task editing overlay.
 *
 * @param {Array} subTask - An array of subtasks containing information about each subtask.
 * @returns {string} The HTML markup for the list of subtasks.
 */
function getEditSubtasksHTML(subTask) {
    let HTML = '';
    if (subTask.length <= 0) return HTML
    for (let i = 0; i < subTask.length; i++) {
        HTML += getCreateSubtaskHTML(subTask[i].descr, i)
    }
    return HTML
}
