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
 * Creates a new task based on user input and adds it to the task list.
 *
 * @function
 * @returns {Promise<void>} - A Promise that resolves after creating and storing the new task.
 */
async function createTask() {
    let taskTitle = setElementValue('addTaskTitle');
    let taskDescription = setElementValue('addTaskDescription');
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
    goDelaydToBoard(1500);
}

/**
 * Sets the value of an HTML element identified by its ID after verifying and sanitizing the input.
 * @param {string} id - The ID of the HTML element.
 * @returns {string} - The sanitized value of the HTML element.
 */
function setElementValue(id) {
    let element = document.getElementById(id);
    let value = verifyValue(element.value);
    return value
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
 * Closes the open dropdown lists and Subtask Edit view.
 *
 */
function closeLists() {
    closeCategoryLists();
    closeUserLists();
    closeSubtaskEdit();
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

/**
 * Delays the redirection to the board page by opening the board URL in the current tab after a specified delay.
 *
 * @param {number} delayTime - The delay time (in milliseconds) before redirecting to the board page.
 */
function goDelaydToBoard(delayTime) {
    if (document.title != 'Join - Add Task') return
    const boardURL = document.getElementById("tabboard").href;
    setTimeout(function () { window.open(boardURL, "_self") }, delayTime);
}