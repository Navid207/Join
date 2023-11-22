/**
 * Edits the task at the specified index by updating its values and renders the tasks.
 *
 * @param {number} idx - The index of the task to be edited.
 * @returns {Promise<void>} A promise that resolves after the task data is updated, overlay card is hidden, and tasks are rendered.
 */
async function editTask(idx) {
    tasks[idx]['title'] = document.getElementById('editTasktaskTitle').value;
    tasks[idx]['descr'] = document.getElementById('editTasktaskDescription').value;
    tasks[idx]['deadline'] = document.getElementById('editTasktaskDate').value;
    tasks[idx]['prio'] = document.querySelector("#ovlyCard input[type='radio']:checked").value;
    tasks[idx]['users'] = getSelectedMembers();
    tasks[idx].subTask = loadSubtasks();
    await setItem('tasks', tasks);
    hideOvlyCard();
    render(tasks);
}

/**
 * Delete  the task at the specified index and renders the tasks.
 *
 * @param {number} idx - The index of the task to be deleted.
 * @returns {Promise<void>} A promise that resolves after the task data is updated, overlay card is hidden, and tasks are rendered.
 */
async function deleteTask(idx) {
    tasks.splice(idx, 1);
    await setItem('tasks', tasks);
    hideOvlyCard();
    render(tasks);
}

/**
 * Displays an overlay indicating that a task has been added to the board with a fade-in animation.
 *
 */
function showOvlyContactAdded() {
    document.getElementById('ovlyTaskaddedToBoard').classList.add("addAnimtaion");
    setTimeout(function () { document.getElementById('ovlyTaskaddedToBoard').classList.remove("addAnimtaion") }, 2000);
}

/**
 * Retrieves the selected members from the overlay edit task wrapper member list.
 *
 * @returns {Array} An array containing the values of the selected members.
 */
function getSelectedMembers() {
    let selectedUsers = document.querySelectorAll('#ovlyEditTaskWrapperMemberList input[type="checkbox"]:checked');
    let members = [];
    for (let i = 0; i < selectedUsers.length; i++) {
        members.push(selectedUsers[i].value)
    }
    return members;
}

/**
 * Opens a dropdown by displaying specified elements and applying styling changes.
 *
 * @param {string} ID - The ID of the element or elements to be displayed as part of the dropdown.
 */
function openDropdown(ID) {
    showElement(ID, '');
    document.getElementById('ovlyEditTaskwrapperAssignedToHL').classList.add('styleOpen');
    document.getElementById('ovlyEditTaskwrapperAssignedToHLImg').classList.add('styleOpen');
    document.getElementById('ovlyEditTaskwrapperAssignedToHL').setAttribute('onclick', 'closeDropdown(["ovlyEditTaskWrapperMemberList"])');
    document.getElementById('ovlyEditTaskWrapperAssignedToActual').classList.add('display-none');
}

/**
 * Closes a dropdown by hiding specified elements, reverting styling changes, and updating click behavior.
 *
 * @param {string} ID - The ID of the element or elements to be hidden as part of the dropdown closure.
 */
function closeDropdown(ID) {
    hideElement(ID, '');
    document.getElementById('ovlyEditTaskwrapperAssignedToHL').classList.remove('styleOpen');
    document.getElementById('ovlyEditTaskwrapperAssignedToHLImg').classList.remove('styleOpen');
    document.getElementById('ovlyEditTaskwrapperAssignedToHL').setAttribute('onclick', 'openDropdown(["ovlyEditTaskWrapperMemberList"])');
    document.getElementById('ovlyEditTaskWrapperAssignedToActual').classList.remove('display-none');
    document.getElementById('ovlyEditTaskWrapperAssignedToActual').innerHTML = getAssignedToHTML(getSelectedMembers());
}
