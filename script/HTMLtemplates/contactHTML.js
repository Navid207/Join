// contact page related templates

/**
 * Generates HTML markup for a message indicating that the contact list is empty.
 *
 * @returns {string} The HTML markup for the empty contact list message.
 */
function getContactlistEmptyHTML() {
    return /*html*/`
        <div id="wrapperNoContacts">
            <span>Your contact list is empty</span>
        </div>
    `;
}

/**
 * Generates HTML markup for the overlay card used to add a new contact.
 *
 * @returns {string} The HTML markup for the new contact overlay card.
 */
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
/**
 * Generates HTML markup for the overlay card used to edit a contact.
 *
 * @param {number} idx - The index of the contact in the contact list.
 * @returns {string} The HTML markup for the edit contact overlay card.
 */
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

/**
 * Generates HTML markup for a contact list element with a letter header.
 *
 * @param {string} letter - The letter to be displayed.
 * @returns {string} The HTML markup for the contact list element with a letter header.
 */
function getContactListLetterHTML(letter) {
    return /*html*/`
        <div class="ContactlistelementLetter">
            <span class="listLetter">${letter}</span>
            <div class="line"></div>
        </div>
    `
}

/**
 * Generates HTML markup for a contact list element with contact details.
 *
 * @param {number} idx - The index of the contact in the list.
 * @param {object} contactData - The data object containing contact details.
 * @returns {string} The HTML markup for the contact list element with contact details.
 */
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
