/**
 * Asynchronously initialization of the board.
 * 
 */
async function initContact(tabID){
    await init(tabID);
    renderContactList(contactListSorted);
    await getAddTaskHTML();
}

/**
 * Renders a contact list in the specified content element based on the sorted contact data.
 *
 * @param {Array} contactListsorted - An array of contact data sorted alphabetically.
 */
function renderContactList(contactListsorted){
    let content = document.getElementById('contactlist');
    if (contactListsorted.length > 0) {
        let letter = contactListsorted[0]['name'][0];
        content.innerHTML = getContactListLetterHTML(letter);;
        for (let i = 0; i < contactListsorted.length; i++) {
            let contactData = contactListsorted[i];
            if (contactData['name'][0] == letter) {
                content.innerHTML += getContactListContactHTML(i,contactData);
            } else {
                letter = contactData['name'][0];
                content.innerHTML += getContactListLetterHTML(letter);
                content.innerHTML += getContactListContactHTML(i,contactData);
            }
            setInitialsColor(i,contactData['color']);
        }
    } else content.innerHTML = getContactlistEmptyHTML();
}

/**
 * Sets the background color of the initials element for a contact at the specified index.
 *
 * @param {number} idx - The index of the contact.
 * @param {string} color - The color to be set as the background color.
 */
function setInitialsColor(idx,color){
    document.getElementById("contactinitialsList" + idx).style.backgroundColor = color;
}

/**
 * Sets the contact details data in the corresponding HTML elements based on the contact index and sorted contact list.
 *
 * @param {number} idx - The index of the contact in the sorted contact list.
 * @param {Array} contactListsorted - An array of contact data sorted alphabetically.
 */
function setContactDetailsData(idx,contactListsorted){
    let contactData = contactListsorted[idx];
    document.getElementById('contactinitials').innerHTML = contactData['initials'];
    document.getElementById('contactinitials').style.backgroundColor = contactData['color'];
    document.getElementById('contactname').innerHTML = contactData['name'];
    document.getElementById('contactemail').innerHTML = contactData['email'];
    document.getElementById('contactemail').setAttribute('href', 'mailto:' + contactData['email']);
    document.getElementById('contactnumber').innerHTML = contactData['phone'];
    document.getElementById('contactnumber').setAttribute('href' ,'Tel:' + contactData['phone']);
    document.getElementById('btneditContact').setAttribute('onclick',`showOvlyCard(getOvlyCardEditContactHTML(${idx}))`);
    document.getElementById('btneditContactRes').setAttribute('onclick',`showOvlyCard(getOvlyCardEditContactHTML(${idx}))`);
    document.getElementById('btndeleteContactRes').setAttribute('onclick',`deleteContact(${idx})`);
}

/**
 * Displays contact details based on the contact ID, sets data, shows the contact card, and applies styling.
 *
 * @param {Event} event - The event object triggering the function (optional).
 * @param {number} contactID - The ID of the contact to display details for.
 */
function showContactDetails(event,contactID){
    hideContactDetails();
    if(event){stopHideElement(event)};
    setContactDetailsData(contactID,contactListSorted);
    setTimeout(function(){document.getElementById('contactCard').classList.add('showcontactCard')},1);
    setContactListActiveStyle(contactID);
    document.getElementById('wrappercontact').style.display = 'block';
    showElement(['wrappercontact'],);
}

/**
 * Sets the active styling for the specified contact in the contact list.
 *
 * @param {number} contactID - The ID of the contact for which to apply active styling.
 */
function setContactListActiveStyle(contactID){
    setContactListPassivStyle();
    document.getElementById('contact'+contactID).classList.add('active');
    document.getElementById('contactNameList'+contactID).style.color = '#FFFFFF';
}

/**
 * Sets the passive styling for the currently active contact in the contact list.
 *
 */
function setContactListPassivStyle(){
    let contactID = document.getElementsByClassName('active Contactlistelement');
    if (contactID.length > 0) {
        contactID = contactID[0]['id'].slice(7);
        document.getElementById('contact'+contactID).classList.remove('active');
        document.getElementById('contactNameList'+contactID).style.color = '#000000';
    }
}

/**
 * Hides the contact details by setting passive styling and removing the 'showcontactCard' class.
 *
 */
function hideContactDetails(){
    setContactListPassivStyle()
    document.getElementById('contactCard').classList.remove('showcontactCard');
}

/**
 * Saves the contact details at the specified index.
 *
 * @param {number} idx - The index of the contact to be saved.
 * @returns {Promise<void>} A promise that resolves after the contact data is updated, saved, and contact details are updated.
 */
async function saveContact(idx){
    if (document.getElementById('wrapperCardDetails').checkValidity()) {       
        hideOvlyCard();
        contactListSorted[idx]['name'] = document.getElementById('formContactName').value;
        contactListSorted[idx]['phone'] = document.getElementById('formContactPhone').value;
        contactListSorted[idx]['email'] = document.getElementById('formContactEmail').value;
        contactListSorted[idx]['initials'] = getContactInitials(document.getElementById('formContactName').value);
        await setItem('contacts',contactListSorted);
        renderContactList(contactListSorted);
        setContactDetailsData(idx,contactListSorted);
        setContactListActiveStyle(idx);
    }
}

/**
 * Deletes the contact at the specified index.
 *
 * @param {number} idx - The index of the contact to be deleted.
 * @returns {Promise<void>} A promise that resolves after the contact data is updated, saved, and contact list is rendered.
 */
async function deleteContact(idx){
    contactListSorted.splice(idx,1);
    await setItem('contacts',contactListSorted);
    hideOvlyCard();
    renderContactList(contactListSorted);
    hideContactDetails();
}

/**
 * Creates a new contact with the provided form data, adds it to the contact list,
 * sets initials, generates a random color, renders the updated contact list,
 * shows the details of the newly created contact, hides the overlay card, and displays a success animation.
 *
 * @returns {Promise<void>} A promise that resolves after the contact is added, list is rendered, details are shown, and overlay is hidden.
 */
async function createContact(){
    if (document.getElementById('wrapperCardDetails').checkValidity()) {
        let contact =  {
            name: document.getElementById('formContactName').value,
            phone: document.getElementById('formContactPhone').value,
            email: document.getElementById('formContactEmail').value,
            initials: getContactInitials(document.getElementById('formContactName').value),
            color: generateRendomColor() // Farbe random zuweisen
        }
        let idx = await addContactToList(contact);
        renderContactList(contactListSorted);
        showContactDetails('',idx);
        hideOvlyCard();
        document.getElementById('ovlyContactSuccCreated').classList.add("addAnimtaion");
        setTimeout(function(){document.getElementById('ovlyContactSuccCreated').classList.remove("addAnimtaion")},2000);
    }
}

/**
 * Adds a new contact to the sorted contact list, sorts the list alphabetically,
 * saves the updated data in local storage, and returns the index of the newly added contact.
 *
 * @param {Object} contact - The contact data to be added to the list.
 * @returns {Promise<number>} A promise that resolves with the index of the newly added contact in the sorted list.
 */
async function addContactToList(contact){
    contactListSorted.push(contact);
    contactListSorted.sort((a,b) => a['name'] < b['name'] ? -1 : a['name'] > b['name'] ? 1 : 0);
    await setItem('contacts',contactListSorted);
    return contactListSorted.findIndex((c) => c['name'] == contact['name'] );
}


// functions for responsive design

function showBtnResContactDetails(event){
    event?stopHideElement(event):'';
    document.getElementById('wrapperBtnResContactDetails').classList.add('showBtnRes');
}

function hideBtnResContactDetails(){
    document.getElementById('wrapperBtnResContactDetails').classList.remove('showBtnRes');
}

// help functions

/**
 * This Function generates a random hex color value
 * 
 * @returns - return a hex color value as a string
 */
function generateRendomColor(){
    let randomColor = Math.floor(Math.random()*16777215).toString(16.).toUpperCase();
    return "#" + randomColor;
}

