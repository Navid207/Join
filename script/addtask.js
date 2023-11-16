let conditNewTask = 0;
let oldSubtask = '';
const CATEGORY = [
    {
        name: 'Design',
        color: '#ff7a00',
    },
    {
        name: 'Sales',
        color: '#fc71ff',
    },
    {
        name: 'Backoffice',
        color: '#1fd7c1',
    },
    {
        name: 'Media',
        color: '#ffc701',

    },
    {
        name: 'Marketing',
        color: '#0038ff',
    },
]

/**
 * Initializes the 'Add Task' tab by performing several asynchronous tasks.
 *
 * @function
 * @returns {Promise<void>} - A Promise that resolves after initializing the 'Add Task' tab.
 */
async function addtaskInit() {
    await init('tabaddtask');
    loadCategory();
    loadUser(contactListSorted);
    loadNewCategoryInput();
    setMinDate('addTaskDueDate');
}

/**
 * Loads task categories into the specified HTML element based on available groups.
 *
 */
function loadCategory() {
    let newCategoryListItems = document.getElementById('newCategoryListItems');
    newCategoryListItems.innerHTML = newCategoryLiHTML();
    for (let j = 0; j < groups.length; j++) {
        const group = groups[j];
        newCategoryListItems.innerHTML += categoryLiHTML(group, j);
        document.getElementById(`color${j}`).style.backgroundColor = group['color'];
    }
}

/**
 * Loads user data into the specified HTML element based on the provided user array.
 *
 * @function
 * @param {Array<Object>} UserrArray - The array of user objects to load into the HTML element.
 */
function loadUser(UserrArray) {
    if (!UserrArray) UserrArray = contactListSorted;
    let listItems = document.getElementsByClassName('userListItems');
    listItems.innerHTML = '';
    addUserToList(UserrArray, listItems);
    addEventListenerForItems('userList');
}

/**
 * Adds user information to a list of HTML list elements.
 *
 * @param {Array} UserrArray - An array of user objects.
 * @param {HTMLLIElement[]} listItems - A list of HTML list elements to which users should be added.
 */
function addUserToList(UserrArray, listItems) {
    for (let i = 0; i < UserrArray.length; i++) {
        const user = UserrArray[i];
        const initials = getContactInitials(user.name);
        listItems[0].innerHTML += contactLiHTML(i, user, initials);
    }
}

/**
 * Adds a click event listener to each item in a list identified by the provided ID.
 * When an item is clicked, it toggles the 'checked' class.
 *
 * @param {string} listId - The ID of the HTML list element.
 */
function addEventListenerForItems(listId) {
    const listElement = document.getElementById(listId);
    const items = listElement.getElementsByClassName('item');
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.addEventListener("click", () => {
            item.classList.toggle('checked');
        })
    }
}

/**
 * Loads selected users into the specified HTML element based on assigned user emails.
 *
 */
function loadSelectetUsers() {
    let assignedUsers = loadAssignedUsers();
    let userSlot = document.getElementById('selectetUsers');
    userSlot.innerHTML = '';
    for (let i = 0; i < assignedUsers.length; i++) {
        const userMail = assignedUsers[i];
        let userIndex = getArrayOfIncludes('email', userMail, contactListSorted)[0];
        let initials = getContactInitials(contactListSorted[userIndex].name);
        userSlot.innerHTML += contectCircleHTML(contactListSorted[userIndex].color, initials)
    }
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

/**
 * Removes the message and styling related to subtask validation.
 *
 */
function removeMsg() {
    let msg = document.getElementById('msgSubTask');
    let input = document.getElementById('subtaskContainer')
    msg.classList.add('d-none');
    input.classList.remove('redBoarder');
}

/**
 * Creates a new task based on user input and adds it to the task list.
 *
 * @function
 * @returns {Promise<void>} - A Promise that resolves after creating and storing the new task.
 */
async function createTask() {
    let taskTitle = document.getElementById('addTaskTitle').value;
    let taskDescription = document.getElementById('addTaskDescription').value;
    let taskDueDate = document.getElementById('addTaskDueDate').value;
    let taskPrio = checkPrioStatus();
    let subtasks = loadSubtasks();
    let assignedUsers = loadAssignedUsers();
    let group = loadChoosedCategory();

    tasks.push({ title: taskTitle, descr: taskDescription, group: group, users: assignedUsers, prio: taskPrio, deadline: taskDueDate, condit: conditNewTask, subTask: subtasks });
    await setItem('tasks', tasks);
    showOvlyTaskAdded()
    hideOvlyCard();
    if (typeof (render) != "undefined") { render(tasks) };
    setTimeout(() => clearTask(), 1000);
    //setTimeout(function () { clearTask() }, 2000);
}

/**
 * Checks and retrieves the priority status of a task from the selected radio button.
 *
 * @function
 * @returns {number} - The priority status of the task (0 for low, 2 for medium, 3 for high).
 */
function checkPrioStatus() {
    let taskPrio = +document.querySelector(".prioContainer input[type='radio']:checked");
    if (taskPrio != 0) return +document.querySelector(".prioContainer input[type='radio']:checked").value;
    else return taskPrio;
}

/**
 * Retrieves the name of the chosen category from the input element.
 *
 * @function
 * @returns {string} - The name of the chosen category.
 */
function loadChoosedCategory() {
    let categoryName = document.getElementById('choosedCatagory').value;
    return categoryName;
}

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
        const subtaskTitle = subtasksTitles[i].innerText;
        subtasks.push({ descr: subtaskTitle, state: 0 });
    }
    return subtasks;
}

/**
 * Renders a user list with selectable items and manages the visibility of the list based on user interaction.
 *
 * @function
 * @param {string} bntClass - The class selector for the button triggering the user list.
 * @param {Event} event - The event object representing the user interaction that triggered the function.
 */
function renderUserList(bntClass, event) {
    event.stopPropagation();
    (bntClass == '.userSelectBtn') ? closeCategoryLists() : closeUserLists();
    const selectBtn = document.querySelector(bntClass);
    selectBtn.classList.toggle("open");
}

/**
 * Retrieves an array of assigned users based on the checked items in the user list.
 *
 * @function
 * @returns {Array<string>} - An array of email addresses of assigned users.
 */
function loadAssignedUsers() {
    let assignedUsers = [];
    let users = document.getElementById('userList').getElementsByClassName('item');
    for (let i = 0; i < users.length; i++) {
        if (users[i].classList.contains('checked')) {
            assignedUsers.push(contactListSorted[i]['email']);
        }
    }
    return assignedUsers;
}

/**
 * Clears the input fields and resets the form for creating a new task.
 *
 */
function clearTask() {
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskDescription').value = '';
    document.getElementById('addTaskDueDate').value = '';
    document.getElementById('choosedCatagory').value = '';
    document.getElementById('subtaskCheckContainer').innerHTML = '';
    clearPrio();
    clearAssignedTo();
    loadSelectetUsers();
}

/**
 * Clears the priority selection for a new task by unchecking all priority checkboxes.
 *
 */
function clearPrio() {
    document.getElementById('urgent').checked = false;
    document.getElementById('medium').checked = false;
    document.getElementById('low').checked = false;
}

/**
 * Clears the selection of assigned users for a new task by removing the "checked" class from all user list items.
 *
 */
function clearAssignedTo() {
    let users = document.getElementById('userList').getElementsByClassName('item');
    for (let i = 0; i < users.length; i++) {
        users[i].classList.remove('checked')
    }
}

/**
 * Displays the input container for creating a new category and hides the existing category selection.
 *
 * @function
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 */
async function newCategory() {
    let newCategoryInput = document.getElementById('newCategoryInputContainer');
    let categorySelect = document.getElementById('categorySelect');
    let categoryColoredDots = document.getElementById('categoryColoredDots');
    newCategoryInput.style = 'display: flex;';
    categorySelect.style.display = 'none';
    categoryColoredDots.style = 'display:flex; justify-content:space-around;margin-block:10px -25px;';
}

/**
 * Dynamically populates the new category input container with radio buttons and colored dots based on predefined categories.
 *
 */
function loadNewCategoryInput() {
    for (let i = 0; i < CATEGORY.length; i++) {
        const group = CATEGORY[i];
        categoryColoredDots.innerHTML += newCategoryDotsHTML(group, i);
        document.getElementById(`newCatColor${i}`).style.backgroundColor = group['color'];
    }
}

/**
 * Closes the new category input container and restores the visibility of the category selection.
 *
 */
function closeNewCategory() {
    let newCategoryInput = document.getElementById('newCategoryInputContainer');
    let categorySelect = document.getElementById('categorySelect');
    let categoryColoredDots = document.getElementById('categoryColoredDots');
    newCategoryInput.style = 'display: none;';
    categorySelect.style.display = 'inline';
    categoryColoredDots.style = 'display:none;';
    let closeMenu = document.getElementsByClassName('categorySelectBtn')[0];
    closeMenu.classList.remove('open');
}

/**
 * Animates the selected colored dot by scaling it up and resets the scale for other colored dots.
 *
 * @function
 * @param {string} value - The value representing the name of the radio button associated with the selected colored dot.
 */
function animateDot(value) {
    let baseScales = document.querySelectorAll('.groupDotColors');
    let colorChoosed = document.getElementById(value);
    baseScales.forEach(baseScale => {
        baseScale.style.scale = '1';
    })
    colorChoosed.style.scale = '1.5';
}

/**
 * Saves a new category with the specified name and chosen color, updates the category list, and closes the new category input container.
 *
 * @async
 * @function
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 */
async function saveNewCategory() {
    let newCategoryName = document.getElementById('newCategoryInput').value;
    let colorChoosed = document.querySelector('#categoryColoredDots input[type="radio"]:checked').value.toString();
    groups.push({ name: newCategoryName, color: colorChoosed });
    await setItem('groups', groups);
    loadCategory();
    closeNewCategory()
}

/**
 * Sets the chosen category in the input field, toggles the visibility of the category selection button, and updates the display accordingly.
 *
 * @function
 * @param {string} category - The name of the chosen category.
 */
function chooseCategory(category) {
    document.getElementById('choosedCatagory').value = category;
    const selectBtn = document.querySelector('.categorySelectBtn');
    selectBtn.classList.toggle("open");
}

/**
 * Deletes the category at the specified index, updates the list of categories, and saves the changes to storage.
 *
 * @async
 * @function
 * @param {number} index - The index of the category to be deleted.
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 */
async function deletCategory(index) {
    event.stopPropagation();
    groups.splice(index, 1);
    await setItem('groups', groups);
    loadCategory();
}

/**
 * Closes the open dropdown lists and Subtask Edit view.
 *
 */
function closeLists() {
    closeCategoryLists();
    closeUserLists();
    closeSubtaskEdit();
}

/**
 * Closes the category selection list by removing the 'open' class.
 * 
 */
function closeCategoryLists() {
    let categorylist = document.querySelector('.categorySelectBtn');
    if (categorylist) categorylist.classList.remove('open');
}

/**
 * Closes the user list by removing the 'open' class.
 * 
 */
function closeUserLists() {
    let userlist = document.querySelector('.userSelectBtn');
    if (userlist) {
        userlist.classList.remove('open');
        loadSelectetUsers();
    }
}

/**
 * Displays the overlay indicating that a task has been added to the board with a fade-in and fade-out animation.
 *
 */
function showOvlyTaskAdded() {
    if (document.getElementById('ovlyTaskaddedToBoard')) {
        document.getElementById('ovlyTaskaddedToBoard').classList.add("addAnimtaion");
        setTimeout(function () { document.getElementById('ovlyTaskaddedToBoard').classList.remove("addAnimtaion") }, 2000);
    }
}

/**
 * Checks the form inputs for the "Add Task" operation and displays error messages if any required field is missing.
 * Submits the form if all required fields are filled.
 *
 */
function checkForm() {
    let title = document.getElementById('addTaskTitle').value;
    let descr = document.getElementById('addTaskDescription').value;
    let date = document.getElementById('addTaskDueDate').value;
    let categ = document.getElementById('choosedCatagory').value;
    if (title && descr && date && categ) return document.getElementById('addTask').submit();
    if (!title) setMsg('msgTitle', 'addTaskTitle');
    if (!descr) setMsg('msgDescrip', 'addTaskDescription');
    if (!date) setMsg('msgDate', 'addTaskDueDate');
    if (!categ) setMsg('msgCateg', 'addTaskCateg');
}

/**
 * Sets an error message and adds a visual indicator (red border) to the specified input field.
 *
 * @function
 * @param {string} idMsg - The ID of the element containing the error message.
 * @param {string} idInput - The ID of the input field to which the visual indicator will be applied.
 */
function setMsg(idMsg, idInput) {
    document.getElementById(idMsg).classList.remove('d-none');
    document.getElementById(idInput).classList.add('redBoarder');
}

/**
 * Sets the minimum date for the specified input field based on the current date.
 *
 * @function
 * @param {string} id - The ID of the input field for which the minimum date will be set.
 */
function setMinDate(id) {
    let input = document.getElementById(id);
    let min = new Date().toLocaleDateString('fr-ca');
    input.setAttribute("min", min);
}
