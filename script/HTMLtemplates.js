// contact page related templates

function getOvlyCardNewContactHTML (){
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


function getOvlyCardEditContactHTML(idx){
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
async function getAddTaskHTML(){
    let response = await fetch('../templates/addtask.html');
    AddTaskHTML = await response.text();
    AddTaskHTML = /*html*/`
        <div id="ovlyCardAddTask">
            ${AddTaskHTML}
            <button id="ovlyBtnClose" onclick="hideOvlyCard()"></button>
        </div>
    `
}


function getContactListLetterHTML(letter){
    return /*html*/`
        <div class="ContactlistelementLetter">
            <span class="listLetter">${letter}</span>
            <div class="line"></div>
        </div>
    `
}


function getContactListContactHTML(idx,contactData){
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


// Board page related templates

function getOvlyTaskHTML(idx){
    let task = tasks[idx];
    let assignedToHTML= getAssignedToHTML(task['users'],'withName');
    return /*html*/`
        <div id="ovlyCardTask">
            <button id="ovlyBtnClose" onclick="hideOvlyCard()"></button>
            ${getGroupHTML (task['group'])}
            <span id="ovlyTaskTitle">${task['title']}</span>
            <span id="ovlyTaskDescription">${task['descr']}</span>
            <div id="ovlyTaskWrapperDueDate">
                <span><b>Due date:</b></span>
                <span>${task['deadline']}</span>
            </div>
            <div id="ovlyTaskWrapperPrio">
                <span><b>Priority:</b></span>
                ${getPriorityHTML(task['prio'])}
            </div>
            <div id="ovlyTaskWrapperAssignedTo">
                <span><b>Assigned To:</b></span>
                <div id="ovlyTaskWrapperAssignedToList">
                    ${assignedToHTML}
                </div>
            </div>
            <div id="ovlyTaskWrapperBtn">
                <button class="but-light" onclick="deleteTask(${idx})">
                    <div></div>
                </button>
                <button class="but-dark" onclick="showOvlyCard(getOvlyEditTaskHTML(${idx}))">
                    <img src="../img/icons/edit-white.svg" alt="">
                </button>
            </div>
        </div>
    `
}

function getPriorityHTML(prio){
    let prioName, prioImg, prioColor;
    if (prio == 2) {
        prioName = 'Urgent';
        prioImg = '../img/icons/Add-Task-Prio-Urgent-hover.svg';
        prioColor='#FF3D00';
    } else if(prio == 1){
        prioName = 'Medium';
        prioImg = '../img/icons/Add-Task-Prio-Medium-hover.svg';
        prioColor='#FFA800';
    } else {
        prioName = 'Low';
        prioImg = '../img/icons/Add-Task-Prio-Low-hover.svg';
        prioColor='#7AE229';
    }
    return /*html*/`
        <div id="ovlyTaskPrio" style="background-color: ${prioColor};">
            <span>${prioName}</span>
            <img src="${prioImg}" alt="">
        </div>
    `
}

function getAssignedToHTML(members,includeName){
    let member, HTML='';
    for (let i = 0; i < members.length; i++) {
        member = contactListSorted.filter(c => c['email'] == members[i])[0]; // email is unique
        if (includeName) {
            HTML += /*html*/`
            <div class="ovlyAssignedToElement">
                <span style="background-color: ${member['color']};">${member['initials']}</span>
                <span>${member['name']}</span>
            </div>
        `
        } else {
            HTML += /*html*/`
            <div class="ovlyAssignedToElement">
                <span style="background-color: ${member['color']};">${member['initials']}</span>
            </div>
        `
        }
    }
    return HTML;
}

function getGroupHTML (groupName){
    let color;
    let filter = (groups.filter(g => g['name'] == groupName)[0]);
    if (filter) color=filter['color'];
    else color = '#9797a5'
    return /*html*/`
        <span style="background-color: ${color}" id="ovlyTaskGroup">${groupName}</span>
    `
}


function getOvlyEditTaskHTML (idx){
    let task = tasks[idx];
    let assignedToHTML= getAssignedToHTML(task['users']);
    return /*html*/`
        <button id="ovlyBtnClose" onclick="hideOvlyCard()"></button>
        <form id="ovlyTaskEditform" action="" onsubmit="return false">
            <div>
                <label for="editTasktaskTitle">Title</label>
                <input id="editTasktaskTitle" type="text" placeholder="Enter a title" required value="${task['title']}">
            </div>
            <div id="wrapperEditTaskDescription">
                <label for="editTasktaskDescription">Description</label>
                <textarea name="" id="editTasktaskDescription" cols="30" rows="5" placeholder="Enter a Description" required>${task['descr']}</textarea>
            </div>
            <div>
                <label for="editTasktaskDate">Due date</label>
                <input type="date" id="editTasktaskDate" required value="${task['deadline']}">
            </div>
            <div>
                <span>Prio</span>
                <div id="editTaskwrapperPrio">
                    ${getPrioHTML(task['prio'])}
                </div>
            </div>
            <div id="ovlyEditTaskWrapperAssignedTo">
                <span>Assigned to</span>
                <div class="" id="ovlyEditTaskwrapperAssignedToHL" onclick="openDropdown(['ovlyEditTaskWrapperMemberList'])">    
                    <span>Select contacts to assign</span>
                    <img id="ovlyEditTaskwrapperAssignedToHLImg" src="../img/icons/down-arrow.png" alt=""> 
                </div>
                <div class="display-none" id="ovlyEditTaskWrapperMemberList">
                    ${getMemberListHTML(task)}
                </div>
                <div id="ovlyEditTaskWrapperAssignedToActual">
                    ${assignedToHTML}
                </div>
            </div>
            <button id="ovlyEditTaskOkBtn" class="but-dark" onclick="editTask(${idx})">
                <span>OK</span>
                <img src="../img/icons/check.svg" alt="">
            </button>
        </form>
    `
}

function getPrioHTML(prio){
    let checked = ['', '',''];
    checked[prio]='checked';
    return /*html*/`
        <input id="editTaskPrioUrgent" type="radio" name="editTaskPrio" ${checked[2]} required value=2>
        <label id="editTaskPrioUrgentlabel" for="editTaskPrioUrgent">
            <span>Urgent</span>
            <div class="editTaskPrioImg" id="editTaskPrioImgUrgent"></div>
        </label>
        <input id="editTaskPrioMedium" type="radio" name="editTaskPrio" ${checked[1]} value=1>
        <label id="editTaskPrioMediumlabel" for="editTaskPrioMedium">
            <span>Medium</span>
            <div class="editTaskPrioImg" id="editTaskPrioImgMedium"></div>
        </label>
        <input id="editTaskPrioLow" type="radio" name="editTaskPrio" ${checked[0]} value=0>
        <label id="editTaskPrioLowlabel" for="editTaskPrioLow">
            <span>Low</span>
            <div class="editTaskPrioImg" id="editTaskPrioImgLow"></div>
        </label>
    `
}


function getMemberListHTML(task){
    let HTML = '';
    for (let i = 0; i < contactListSorted.length; i++) {
        let contact = contactListSorted[i];
        let checked;
        checked = task['users'].indexOf(contact['email']) == -1? '' : 'checked';
        HTML += /*html*/`
            <div id="ovlyEditTaskWrapperMemberListElement">
                <label for="member${i}">${contact['name']}</label>
                <input id="member${i}" type="checkbox" value="${contact['email']}" ${checked}>
            </div>
        `
    }
    return HTML;
}