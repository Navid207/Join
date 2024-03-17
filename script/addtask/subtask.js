/**
 * Retrieves an array of subtasks from the subtask wrappers.
 *
 * @function
 * @returns {Array<Object>} - An array of subtask objects with description and initial state.
 */
function loadSubtasks() {
    let subtasks = [];
    let subtasksTitles = document.getElementsByClassName('subtaskWrapper');
    for (let i = 0; i < subtasksTitles.length; i++) {
        const subtaskTitle = verifyValue(subtasksTitles[i].innerText);
        subtasks.push({ descr: subtaskTitle, state: 0 });
    }
    return subtasks;
}

/**
 * Creates a new subtask and appends it to the specified unordered list (ulId).
 *
 * @function
 * @param {string} subtaskId - The ID of the input element containing the subtask text.
 * @param {string} ulId - The ID of the unordered list where the subtask will be appended.
 */
function createSubtask(subtaskId, ulId) {
    let subtask = document.getElementById(subtaskId).value;
    let number = document.getElementsByClassName('subtaskWrapper').length;
    let subtaskContainer = document.getElementById(ulId);
    if (subtask == '') setMsg('msgSubTask', 'subtaskContainer');
    else {
        subtaskContainer.innerHTML += getCreateSubtaskHTML(subtask, number);
        document.getElementById(subtaskId).value = ''
    }
}

/**
 * Hides the edit section of a subtask with the specified ID.
 *
 * @function
 * @param {string} id - The ID of the subtask for which to hide the edit section.
 */
function subtaskHideEdit(id) {
    document.getElementById(`editSubtask${id}`).classList.add('d-none');
}

/**
 * Displays the edit section of a subtask with the specified ID.
 *
 * @function
 * @param {string} id - The ID of the subtask for which to display the edit section.
 */
function subtaskShowEdit(id) {
    document.getElementById(`editSubtask${id}`).classList.remove('d-none');
}

/**
 * Deletes a subtask with the specified ID by removing its corresponding HTML element.
 *
 * @function
 * @param {string} id - The ID of the subtask to be deleted.
 */
function deletSubtask(id) {
    document.getElementById(`Subtask${id}`).remove();
}

/**
 * Initiates the editing process for a subtask with the specified ID.
 * Stops event propagation, closes category and user lists, and switches the subtask content
 * to an editable form for modification.
 *
 * @param {string} id - The ID of the subtask to be edited.
 */
function editSubtask(id) {
    event.stopPropagation();
    closeCategoryLists();
    closeUserLists();
    oldSubtask = document.getElementById('titleSubtask' + id).innerHTML;
    document.getElementById('Subtask' + id).innerHTML = getSubtasksEditHTML(id);
    document.getElementById('EditSubtask' + id).value = oldSubtask;
}

/**
 * Saves the edited content of a subtask with the specified ID.
 *
 * @param {string} id - The ID of the subtask to be saved.
 * @param {string} [subtask] - Optional. The edited content of the subtask. If not provided, it is retrieved from the input field.
 */
function saveSubtask(id, subtask) {
    if (!subtask) subtask = document.getElementById('EditSubtask' + id).value;
    document.getElementById('Subtask' + id).innerHTML = getSubtasksContentHTML(subtask, id);
}

/**
 * Closes the editing interface for a subtask, saving the changes if applicable.
 * 
 */
function closeSubtaskEdit() {
    if (document.querySelector(".subtaskWrapperLineEdit")) {
        let editSubtasks = document.querySelector(".subtaskWrapperLineEdit").firstChild;
        id = +editSubtasks.nextElementSibling.id.replace(/^\D+/g, '');
        saveSubtask(id, oldSubtask)
    }
}