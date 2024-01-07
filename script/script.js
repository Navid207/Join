// constants
const STORAGE_TOKEN = '0GG4X1CYZ51PJA0PR5I6U02CWNF21LHSH33IZ56P';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const URL_PARAMS = new URLSearchParams(window.location.search);
const USER = URL_PARAMS.get('user');


let activeTab;
let contactListSorted = [];
let tasks = [];
let groups = [];


// common used funcitons

/**
 * Asynchronously initializes a tab by including HTML, fetching data, and setting various UI elements.
 *
 * @function
 * @param {string} tabID - The ID of the tab to be initialized.
 * @returns {Promise<void>} A Promise that resolves after the initialization tasks are completed.
 */
async function init(tabID) {
    await includeHTMLasync();
    await getData();
    setActiveMenuTab(tabID);
    activeTab = tabID;
    setHeaderUserData();
    setTabLink(USER);
}

/**
 * Includes HTML code from other files asynchronously, updating the content of specified div elements.
 *
 * @function
 * @returns {Promise<void>} - A Promise that resolves after including HTML code from other files.
 */
async function includeHTMLasync() {
    let includeElements = document.querySelectorAll('[w3-include-html]'); // get all Elements with attribut [w3-include-html]
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // get value of attribut w3-include-html of this element
        let response = await fetch(file); // load file and save HTML code in response
        if (response.ok) { // check if response is ok (file found)
            element.innerHTML = await response.text(); // change inner HTML of element to new HTML code
        } else {
            element.innerHTML = "Page not found."; // change inner HTML of element to "Page not found."
        }
    }
}

/**
 * Asynchronously fetches data including contact list, tasks, and groups,
 * and performs additional processing on the tasks.
 *
 * @function
 * @returns {Promise<void>} A Promise that resolves after data fetching and processing tasks are completed.
 */
async function getData() {
    contactListSorted = await getItem('contacts');
    tasks = await getItem('tasks');
    groups = await getItem('groups');
    mapTasks();
}

/**
 * Function to set a value at the server.
 * Sets a key-value pair in the remote storage using a POST request.
 *
 * @function
 * @param {string} key - The key to set in the storage.
 * @param {any} value - The value to associate with the key in the storage.
 * @returns {Promise<Object>} - A Promise that resolves with the response from the storage server.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Function to get a value from the server.
 * Retrieves the value associated with a key from the remote storage using a GET request.
 *
 * @function
 * @param {string} key - The key for which to retrieve the associated value.
 * @returns {Promise<any>} - A Promise that resolves with the value associated with the key from the storage.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    let response = await fetch(url).then(res => res.json());
    response = response['data']['value'].replace(/\'/g, '"');
    return JSON.parse(response);
}

/**
 * Maps the existing task data to a new array of Task objects with updated properties.
 */
function mapTasks() {
    tasks = tasks.map(task => new Task(
        task.title,
        task.descr,
        task.group,
        task.users,
        task.deadline,
        task.prio,
        task.condit,
        task.subTask,
    ))
}

/**
 * Shows HTML elements with the specified IDs by removing the 'display-none' class.
 *
 * @param {string | Array<string>} ID - The ID or an array of IDs of the HTML elements to show.
 * @param {Event} [event] - An optional event object. If provided, stops its propagation.
 */
function showElement(ID, event) {
    if (event) { event.stopPropagation() };
    for (let i = 0; i < ID.length; i++) {
        document.getElementById(ID[i]).classList.remove('display-none');
    }
}

/**
 * Hides HTML elements with the specified IDs by adding the 'display-none' class.
 *
 * @param {string | Array<string>} ID - The ID or an array of IDs of the HTML elements to hide.
 */
function hideElement(ID) {
    for (let i = 0; i < ID.length; i++) {
        document.getElementById(ID[i]).classList.add('display-none');
    }
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
 * Displays an overlay card with the provided HTML content.
 *
 * @param {string} cardHTML - The HTML content to be displayed within the overlay card.
 */
function showOvlyCard(cardHTML) {
    document.getElementById('ovlyCard').classList.add('showovlyCard');
    document.getElementById('ovly').classList.add('showovly');
    document.getElementById('ovlyCard').innerHTML = cardHTML;
}

/**
 * Hides the overlay card.
 */
function hideOvlyCard() {
    if (document.getElementById('ovlyCard')) {
        document.getElementById('ovlyCard').classList.remove('showovlyCard');
        document.getElementById('ovly').classList.remove('showovly');
    }
}

/**
 * Stops the propagation of the given event.
 *
 * @param {Event} event - The event object for which propagation should be stopped.
 */
function stopHideElement(event) {
    event.stopPropagation();
}

/**
 * Extracts initials from a given name by taking the first letter of each word.
 *
 * @param {string} name - The full name from which initials are extracted.
 * @returns {string} - The extracted initials.
 */
function getContactInitials(name) {
    let separatedName = name.split(" ");
    return separatedName[0][0] + separatedName[1][0];
}

/**
 * Finds the index of an object in an array based on a specified property value.
 *
 * @param {string} ValueToSearch - The property name to search for.
 * @param {any} valueToFind - The value of the specified property to find.
 * @param {Array<Object>} dataArray - The array of objects to search within.
 * @returns {number} - The index of the object in the array or returns -1 if not found.
 */
function findIndexByValue(ValueToSearch, valueToFind, dataArray) {
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i][ValueToSearch] == valueToFind) {
            return i;
        }
    }
    return -1;
}

/**
 * Sets the active state for a specified menu tab and removes the active state from others.
 *
 * @param {string} tabID - The ID of the menu tab to set as active.
 */
function setActiveMenuTab(tabID) {
    let tabIDs = ['tabsummary', 'tabboard', 'tabaddtask', 'tabcontacts', 'tabimpressum'];
    for (let i = 0; i < 5; i++) {
        document.getElementById(tabIDs[i]).classList.remove('active');
    }
    if (tabID) {
        document.getElementById(tabID).classList.add('active');
    }
}

/**
 * Sets the href attribute of navigation links for each menu tab based on the provided user ID.
 *
 * @param {string} userID - The ID of the user for constructing the href attributes.
 */
function setTabLink(userID) {
    if (userID) {
        document.getElementById('tabsummary').setAttribute('href', `../pages/summary.html?user=${userID}`);
        document.getElementById('tabboard').setAttribute('href', `../pages/board.html?user=${userID}`);
        document.getElementById('tabaddtask').setAttribute('href', `../pages/addtask.html?user=${userID}`);
        document.getElementById('tabcontacts').setAttribute('href', `../pages/contacts.html?user=${userID}`);
    }
}

/**
 * Logs the user out by preventing the default behavior of the given event.
 *
 * @param {Event} event - The event object associated with the logout action.
 */
function logout(event) {
    stopHideElement(event);
}

/**
 * Sets user-specific data in the page header, such as initials based on the user's name.
 * If no user is logged in (Guest), displays 'Guest' in the header.
 *
 * @function
 * @returns {Promise<void>} - A Promise that resolves after setting the header user data.
 */
async function setHeaderUserData() {
    let userID = USER;
    if (userID) {
        let users = await getItem('users');
        let user = users.filter(u => u['id'] == userID);
        if (user.length != 0) {
            let initials = getContactInitials(user[0]['name']);
            document.getElementById('headerInitials').innerHTML = initials;
        }
        else console.warn('userID not found');
    }
    else document.getElementById('headerInitials').innerHTML = 'Guest';
}

/**
 * Finds the indices of objects in an array based on whether a specified property value includes a given string.
 *
 * @function
 * @param {string} ValueToSearch - The property name to search for.
 * @param {string} valueToFind - The string to search for within the specified property values.
 * @param {Array<Object>} dataArray - The array of objects to search within.
 * @returns {Array<number>} - An array of indices of objects in the array that match the search criteria.
 */
function getArrayOfIncludes(ValueToSearch, valueToFind, dataArray) {
    let Indexs = [];
    for (let i = 0; i < dataArray.length; i++) {
        let toSearch = dataArray[i][ValueToSearch].toLowerCase();
        let toFind = valueToFind.toLowerCase();
        if (toSearch.includes(toFind)) Indexs.push(i);
    }
    return Indexs;
}

/**
 * Displays the dropdown menu.
 *
 */
function toggleShowMenu(event) {
    event.stopPropagation();
    let dropdownMenu = document.getElementById('dropdownMenu').classList;
    (dropdownMenu.value === '')? dropdownMenu.add('display-none') : dropdownMenu.remove('display-none');
}

/**
 * Displays the legal notice content.
 *
 * @param {Event} event - The event triggering the function.
 */
function showLegalNotice(event) {
    showElement(['contentImpressum'],event);
    hideElement(['content','contentHelp']);
    setActiveMenuTab('tabimpressum');
}

/**
 * Displays the help content.
 *
 * @param {Event} event - The event triggering the function.
 */
function showHelp(event) {
    showElement(['contentHelp'],event);
    hideElement(['content','contentImpressum']);
    setActiveMenuTab();
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

function mergeArraysWithoutDuplicates(arr1, arr2) {
    const mergedArray = arr1;
    for (let i = 0; i < arr2.length; i++) {
      if (!mergedArray.includes(arr2[i])) {
        mergedArray.push(arr2[i]);
      }
    }
    return mergedArray;
  }