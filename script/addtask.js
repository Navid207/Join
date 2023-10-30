async function addtaskInit() {
    await init('tabaddtask');
    loadCategory();
    loadUser();
    loadNewCategoryInput();
}


function loadCategory() {
    let newCategoryListItems = document.getElementById('newCategoryListItems');
    newCategoryListItems.innerHTML = /*html*/`
            <li id="newCategory" onclick="newCategory()">
                <span>New category</span>
            </li>
        `;
    for (let j = 0; j < groups.length; j++) {
        const group = groups[j];
        newCategoryListItems.innerHTML += /*html*/`
        <li class="item" onclick="chooseCategory('${group['name']}')">
            <span>${group['name']}</span>
            <input type="radio" id="" name="tabs" value="${group['name']}" />
            <span class = "groupDotColors" id="color${j}"></span>
        </li>`;
        document.getElementById(`color${j}`).style.backgroundColor = group['color'];
    }
}



function loadUser() {
    let listItems = document.getElementsByClassName('userListItems');
    for (let i = 0; i < contactListSorted.length; i++) {
        const user = contactListSorted[i];
        listItems[0].innerHTML += /*html*/`
        <li class="item">
            <span class="item-text">${user['name']}</span>
            <i class="fa-solid fa-check check-icon"></i>
            <span class="checkbox"></span>
        </li>`;
    }
}


function createSubtask() {
    let subtask = document.getElementById('addTaskSubTask').value;
    let subtaskContainer = document.getElementById('subtaskCheckContainer');
    if (subtask == '') {
        alert("Please enter a valid Sub Task");
    } else {
        subtaskContainer.innerHTML += /*html*/`
    <div class="subtaskWrapper">
        <input type="checkbox" name="subtask">
        <div id="titleSubtask" class="subtasksTitles" >${subtask}</div>
    </div>
    `;
        document.getElementById('addTaskSubTask').value = ''
    }
    let chkbox = document.querySelector('input[name="tabs"]:checked');

}


let category = [];
async function createTask() {
    let taskTitle = document.getElementById('addTaskTitle').value;
    let taskDescription = document.getElementById('addTaskDescription').value;
    let taskDueDate = document.getElementById('addTaskDueDate').value;
    let taskPrio = +document.querySelector(".prioContainer input[type='radio']:checked").value;
    let subtasks = [];

    loadSubtasks(taskPrio, subtasks);
    let assignedUsers = loadAssignedUsers();
    let group = loadChoosedCategory();

    tasks.push({ title: taskTitle, descr: taskDescription, group: group, users: assignedUsers, prio: taskPrio, deadline: taskDueDate, condit: 0, subTask: subtasks });
    await setItem('tasks', tasks);
    showOvlyTaskAdded()
    hideOvlyCard();
    if(typeof(render)!="undefined"){render(tasks)};
    setTimeout(function(){clearTask()},2000);
}


function loadChoosedCategory() {
    let categorylistItems = document.getElementById('newCategoryListItems');
    let categoryName = categorylistItems.getElementsByClassName('item checked')[0].querySelector('input').value;
    return categoryName;
}


function loadSubtasks(taskPrio, subtasks) {

    let subtasksTitles = document.getElementsByClassName('subtasksTitles');
    if (taskPrio != null) {
        for (let i = 0; i < subtasksTitles.length; i++) {
            const subtaskTitle = subtasksTitles[i].innerText;
            subtasks.push({ descr: subtaskTitle, state: 0 });
        }
    }
    return subtasks;

}


function renderUserList(bntClass, listId) {
    const selectBtn = document.querySelector(bntClass);
    const listElement = document.getElementById(listId);
    const items = listElement.getElementsByClassName('item');
  
    selectBtn.classList.toggle("open");
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.addEventListener("click", () => {   
            item.classList.toggle('checked');         
            }
        )
    }
}



function loadAssignedUsers() {
    let assignedUsers = [];
    let users = document.getElementById('userList').getElementsByClassName('item');
    for (let i = 0; i < users.length; i++) {
        if (users[i].classList.contains('checked')){
            assignedUsers.push(contactListSorted[i]['email']);
        }        
    }
    return assignedUsers;
}


function clearTask() {
    location.reload();
}


async function newCategory() {
    let newCategoryInput = document.getElementById('newCategoryInputContainer');
    let categorySelect = document.getElementById('categorySelect');
    let categoryColoredDots = document.getElementById('categoryColoredDots');
    newCategoryInput.style = 'display: flex;align-items: baseline;';
    categorySelect.style.display = 'none';
    categoryColoredDots.style = 'display:flex; justify-content:space-around;margin-top:10px;';
}


function loadNewCategoryInput() {
    for (let i = 0; i < 5; i++) {
        const group = groups[i];

        categoryColoredDots.innerHTML += /*html*/`
        <input type="radio" id="${group['color']}" name="newCatColor${i}" value="${group['color']}" onclick="animateDot(this.name)" />
        <label id="newCatColor${i}" class="groupDotColors" for="${group['color']}"></label>        
        `;
        document.getElementById(`newCatColor${i}`).style.backgroundColor = group['color'];
    }
}


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


function animateDot(value) {
    let baseScales = document.querySelectorAll('.groupDotColors');
    let colorChoosed = document.getElementById(value);
    baseScales.forEach(baseScale => {
        baseScale.style.scale = '1';
    })
    colorChoosed.style.scale = '1.2';
}


async function saveNewCategory() {
    let newCategoryName = document.getElementById('newCategoryInput').value;
    let colorChoosed = document.querySelector('#categoryColoredDots input[type="radio"]:checked').value.toString();
    groups.push({ name: newCategoryName, color: colorChoosed });
    await setItem('groups', groups);
    loadCategory();
    closeNewCategory()

}

function chooseCategory(category){
    let group = groups.filter(g => g['name'] == category)[0];
    document.getElementById('choosedCatagory').innerHTML = /*html*/`
        ${group['name']}
        <div class = "groupDotColors" style="background-color:${group['color']}"></div>
    `
    renderUserList('.categorySelectBtn','newCategoryListItems');
}

function closeLists(){
    document.querySelector('.categorySelectBtn').classList.remove('open');
    document.querySelector('.userSelectBtn').classList.toggle('open');
}

function showOvlyTaskAdded(){
    if (document.getElementById('ovlyTaskaddedToBoard')) {
        document.getElementById('ovlyTaskaddedToBoard').classList.add("addAnimtaion");
        setTimeout(function(){document.getElementById('ovlyTaskaddedToBoard').classList.remove("addAnimtaion")},2000);
    }
  }