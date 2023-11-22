// board page related templates

/**
 * Generates HTML markup for a task card, including task details, progress, users, and controls.
 *
 * @param {number} index - The identifier/number of the task.
 * @param {Object} task - The task object containing details like title, description, group, etc.
 * @param {string} prio - The URL to the priority image.
 * @param {string} progress - The HTML markup for displaying task progress.
 * @param {string} useres - The HTML markup for displaying assigned users.
 * @param {string} color - The color associated with the task group.
 * @returns {string} The HTML markup for a task card.
 */
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

/**
 * Generates HTML markup for the controls section of a task card, including move up, move down, and move to options.
 *
 * @param {Object} task - The task object containing details like title, description, group, etc.
 * @param {number} index - The identifier/number of the task.
 * @returns {string} The HTML markup for the controls section of a task card.
 */
function cardControlHTML(task, index) {
    let svgUp = cardControlUpHTML(task, index);
    let svgDown = cardControlDownHTML(task, index);
    let svgMoveTo = /*html*/`
        <!-- <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z"/>
        </svg> -->
    `
    return svgUp + svgMoveTo + svgDown
}

/**
 * Generates HTML markup for the "move up" control of a task card.
 *
 * @param {Object} task - The task object containing details like title, description, group, etc.
 * @param {number} index - The identifier/number of the task.
 * @returns {string} The HTML markup for the "move up" control of a task card.
 */
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

/**
 * Generates HTML markup for the "move down" control of a task card.
 *
 * @param {Object} task - The task object containing details like title, description, group, etc.
 * @param {number} index - The identifier/number of the task.
 * @returns {string} The HTML markup for the "move down" control of a task card.
 */
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

/**
 * Generates HTML markup for the progress bar and status of subtasks.
 *
 * @param {Object[]} showTasks - An array of tasks to be displayed.
 * @param {number} i - The index of the task within the array.
 * @returns {string} The HTML markup for the progress bar and status of subtasks.
 */
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

/**
 * Generates HTML markup for displaying users associated with a task.
 *
 * @param {Object[]} showTasks - An array of tasks to be displayed.
 * @param {number} index - The index of the task within the array.
 * @returns {string} The HTML markup for displaying users associated with a task.
 */
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

/**
 * Generates HTML markup for an empty task slot and inserts it into the specified container.
 *
 * @param {string} condit - The condition or category for which the empty slot HTML is generated.
 * @returns {string} The HTML markup for an empty task slot.
 */
function emptySlotHTML(condit) {
    let slot = document.getElementById(condit);
    return slot.innerHTML = /*html*/`
        <div class="emptyCard">
            <Span>No tasks</Span>
        </div>
    `
}