// add task page related templates

/**
 * Generates HTML markup for a list item representing a button to create a new category.
 *
 * @returns {string} The HTML markup for the new category button list item.
 */
function newCategoryLiHTML() {
    return /*html*/`
    <li id="newCategory" class="but-dark" onclick="newCategory()">
        <span>New category</span>
    </li>
    `;
}

/**
 * Generates HTML markup for a list item representing a contact with initials and a checkbox.
 *
 * @param {number} idx - The index of the contact.
 * @param {Object} user - The user/contact data.
 * @param {string} initials - The initials of the contact.
 * @returns {string} The HTML markup for the contact list item.
 */
function contactLiHTML(idx, user, initials) {
    return /*html*/`
    <li class="item" id="selectUser${idx}">
        <div class="item-user">
            <div style="background-color: ${user['color']}">${initials}</div>
            <span>${user['name']}</span>
        </div>
        <span class="checkbox"></span>
    </li>
    `;
}

/**
 * Generates HTML markup for a circle representing a contact with a specified color and initials.
 *
 * @param {string} color - The background color of the circle.
 * @param {string} initials - The initials of the contact.
 * @returns {string} The HTML markup for the contact circle.
 */
function contectCircleHTML(color, initials) {
    return /*html*/`
    <div style="background-color: ${color}">
        ${initials}
    </div> 
    `
}

/**
 * Generates HTML markup for a list item representing a category with a name, color dot, and delete button.
 *
 * @param {Object} group - The category/group data.
 * @param {number} i - The index of the category in the list.
 * @returns {string} The HTML markup for the category list item.
 */
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

/**
 * Generates HTML markup for radio buttons representing color dots for a new category.
 *
 * @param {Object} group - The category/group data.
 * @param {number} i - The index of the category in the list.
 * @returns {string} The HTML markup for the new category color dots.
 */
function newCategoryDotsHTML(group, i) {
    return/*html*/`
        <input type="radio" id="${group['color']}" name="newCatColor${i}" value="${group['color']}" onclick="animateDot(this.name)" />
        <label id="newCatColor${i}" class="groupDotColors" for="${group['color']}"></label>        
    `
}

/**
 * Generates HTML markup for a subtask wrapper list item with the provided subtask content and number.
 *
 * @param {string} subtask - The content of the subtask.
 * @param {number} number - The identifier/number of the subtask.
 * @returns {string} The HTML markup for the subtask wrapper list item.
 */
function getCreateSubtaskHTML(subtask, number) {
    return /*html*/`
    <li class="subtaskWrapper" id="Subtask${number}">
        ${getSubtasksContentHTML(subtask, number)}
    </li>
    `;
}

/**
 * Generates HTML markup for a subtask wrapper line with subtask content, an edit button, and a delete button.
 *
 * @param {string} subtask - The content of the subtask.
 * @param {number} number - The identifier/number of the subtask.
 * @returns {string} The HTML markup for the subtask wrapper line.
 */
function getSubtasksContentHTML(subtask, number) {
    return /*html*/`
    <div class="subtaskWrapperLine" onmouseover="subtaskShowEdit(${number})" onmouseout ="subtaskHideEdit(${number})">
        <span id="titleSubtask${number}" class="subtasksTitles" >${subtask}</span>
        <div class="d-none" id="editSubtask${number}">
           <svg viewBox="0 0 21 30" xmlns="http://www.w3.org/2000/svg" onclick="editSubtask(${number})">
                <path d="M2.87121 22.0156L7.69054 24.9405L20.3337 4.10836C20.6203 3.63622 20.4698 3.02119 19.9977 2.73465L16.8881 0.847421C16.4159 0.560878 15.8009 0.71133 15.5144 1.18347L2.87121 22.0156Z"/>
                <path d="M2.28614 22.9793L7.10547 25.9042L2.37685 28.1891L2.28614 22.9793Z"/>
            </svg>
            <svg viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg" onclick="deletSubtask(${number})">
                <path d="M3.5 18C2.95 18 2.47917 17.8042 2.0875 17.4125C1.69583 17.0208 1.5 16.55 1.5 16V3C1.21667 3 0.979167 2.90417 0.7875 2.7125C0.595833 2.52083 0.5 2.28333 0.5 2C0.5 1.71667 0.595833 1.47917 0.7875 1.2875C0.979167 1.09583 1.21667 1 1.5 1H5.5C5.5 0.716667 5.59583 0.479167 5.7875 0.2875C5.97917 0.0958333 6.21667 0 6.5 0H10.5C10.7833 0 11.0208 0.0958333 11.2125 0.2875C11.4042 0.479167 11.5 0.716667 11.5 1H15.5C15.7833 1 16.0208 1.09583 16.2125 1.2875C16.4042 1.47917 16.5 1.71667 16.5 2C16.5 2.28333 16.4042 2.52083 16.2125 2.7125C16.0208 2.90417 15.7833 3 15.5 3V16C15.5 16.55 15.3042 17.0208 14.9125 17.4125C14.5208 17.8042 14.05 18 13.5 18H3.5ZM3.5 3V16H13.5V3H3.5ZM5.5 13C5.5 13.2833 5.59583 13.5208 5.7875 13.7125C5.97917 13.9042 6.21667 14 6.5 14C6.78333 14 7.02083 13.9042 7.2125 13.7125C7.40417 13.5208 7.5 13.2833 7.5 13V6C7.5 5.71667 7.40417 5.47917 7.2125 5.2875C7.02083 5.09583 6.78333 5 6.5 5C6.21667 5 5.97917 5.09583 5.7875 5.2875C5.59583 5.47917 5.5 5.71667 5.5 6V13ZM9.5 13C9.5 13.2833 9.59583 13.5208 9.7875 13.7125C9.97917 13.9042 10.2167 14 10.5 14C10.7833 14 11.0208 13.9042 11.2125 13.7125C11.4042 13.5208 11.5 13.2833 11.5 13V6C11.5 5.71667 11.4042 5.47917 11.2125 5.2875C11.0208 5.09583 10.7833 5 10.5 5C10.2167 5 9.97917 5.09583 9.7875 5.2875C9.59583 5.47917 9.5 5.71667 9.5 6V13Z"/>
            </svg>
        </div>
    </div>
    `
}

/**
 * Generates HTML markup for editing a subtask, including an input field for the subtask title and buttons for saving and deleting.
 *
 * @param {number} number - The identifier/number of the subtask.
 * @returns {string} The HTML markup for editing a subtask.
 */
function getSubtasksEditHTML(number) {
    return /*html*/`
    <div class="subtaskWrapperLineEdit" onclick="event.stopPropagation()">
        <input type="text" id="EditSubtask${number}" class="subtasksTitles">    
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" onclick="saveSubtask(${number})">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
            <svg viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg" onclick="deletSubtask(${number})">
                <path d="M3.5 18C2.95 18 2.47917 17.8042 2.0875 17.4125C1.69583 17.0208 1.5 16.55 1.5 16V3C1.21667 3 0.979167 2.90417 0.7875 2.7125C0.595833 2.52083 0.5 2.28333 0.5 2C0.5 1.71667 0.595833 1.47917 0.7875 1.2875C0.979167 1.09583 1.21667 1 1.5 1H5.5C5.5 0.716667 5.59583 0.479167 5.7875 0.2875C5.97917 0.0958333 6.21667 0 6.5 0H10.5C10.7833 0 11.0208 0.0958333 11.2125 0.2875C11.4042 0.479167 11.5 0.716667 11.5 1H15.5C15.7833 1 16.0208 1.09583 16.2125 1.2875C16.4042 1.47917 16.5 1.71667 16.5 2C16.5 2.28333 16.4042 2.52083 16.2125 2.7125C16.0208 2.90417 15.7833 3 15.5 3V16C15.5 16.55 15.3042 17.0208 14.9125 17.4125C14.5208 17.8042 14.05 18 13.5 18H3.5ZM3.5 3V16H13.5V3H3.5ZM5.5 13C5.5 13.2833 5.59583 13.5208 5.7875 13.7125C5.97917 13.9042 6.21667 14 6.5 14C6.78333 14 7.02083 13.9042 7.2125 13.7125C7.40417 13.5208 7.5 13.2833 7.5 13V6C7.5 5.71667 7.40417 5.47917 7.2125 5.2875C7.02083 5.09583 6.78333 5 6.5 5C6.21667 5 5.97917 5.09583 5.7875 5.2875C5.59583 5.47917 5.5 5.71667 5.5 6V13ZM9.5 13C9.5 13.2833 9.59583 13.5208 9.7875 13.7125C9.97917 13.9042 10.2167 14 10.5 14C10.7833 14 11.0208 13.9042 11.2125 13.7125C11.4042 13.5208 11.5 13.2833 11.5 13V6C11.5 5.71667 11.4042 5.47917 11.2125 5.2875C11.0208 5.09583 10.7833 5 10.5 5C10.2167 5 9.97917 5.09583 9.7875 5.2875C9.59583 5.47917 9.5 5.71667 9.5 6V13Z"/>
            </svg>
        </div>
    </div>
    `
}