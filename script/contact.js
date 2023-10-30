// contact page related functions
async function initContact(tabID){
    await init(tabID);
    renderContactList(contactListSorted);
    await getAddTaskHTML();
}


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
    } else {
        content.innerHTML =/*html*/`
            <div id="wrapperNoContacts">
                <span>Your contact list is empty</span>
            </div>
        `;
    }

}


function setInitialsColor(idx,color){
    document.getElementById("contactinitialsList" + idx).style.backgroundColor = color;
}


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


function showContactDetails(event,contactID){
    hideContactDetails();
    if(event){stopHideElement(event)};
    setContactDetailsData(contactID,contactListSorted);
    setTimeout(function(){document.getElementById('contactCard').classList.add('showcontactCard')},1);
    setContactListActiveStyle(contactID);

    document.getElementById('wrappercontact').style.display = 'block';
    showElement(['wrappercontact'],);
}


function setContactListActiveStyle(contactID){
    setContactListPassivStyle();
    document.getElementById('contact'+contactID).classList.add('active');
    document.getElementById('contactNameList'+contactID).style.color = '#FFFFFF';
}


function setContactListPassivStyle(){
    let contactID = document.getElementsByClassName('active Contactlistelement');
    if (contactID.length > 0) {
        contactID = contactID[0]['id'].slice(7);
        document.getElementById('contact'+contactID).classList.remove('active');
        document.getElementById('contactNameList'+contactID).style.color = '#000000';
    }
}


function hideContactDetails(){
    setContactListPassivStyle()
    document.getElementById('contactCard').classList.remove('showcontactCard');
}


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


async function deleteContact(idx){
    contactListSorted.splice(idx,1);
    await setItem('contacts',contactListSorted);
    hideOvlyCard();
    renderContactList(contactListSorted);
    hideContactDetails();
}



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

