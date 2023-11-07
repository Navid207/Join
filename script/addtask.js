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
const HTML_NEW_CATEGORY_LI = /*html*/`
                            <li id="newCategory" onclick="newCategory()">
                                <span>New category</span>
                            </li>
                            `;

async function addtaskInit() {
    await init('tabaddtask');
    loadCategory();
    loadUser();
    loadNewCategoryInput();
}

function loadCategory() {
    let newCategoryListItems = document.getElementById('newCategoryListItems');
    newCategoryListItems.innerHTML = HTML_NEW_CATEGORY_LI;
    for (let j = 0; j < groups.length; j++) {
        const group = groups[j];
        newCategoryListItems.innerHTML += categoryLiHTML(group, j);
        document.getElementById(`color${j}`).style.backgroundColor = group['color'];
    }
}

function categoryLiHTML(group, i) {
    return /*html*/`
    <li class="item">
        <div onclick="chooseCategory('${group['name']}')">
            <span>${group['name']}</span>
            <span class = "groupDotColors" id="color${i}" ></span>
        </div>            
        <img src="../img/icons/bin.svg" alt="bin-img" onclick="deletCategory(${i})">
    </li>`
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
    if (subtask == '') setMsg('msgSubTask','subtaskContainer');
    else {
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

function removeMsg() {
    let msg = document.getElementById('msgSubTask');
    let input = document.getElementById('subtaskContainer')
    msg.classList.add('d-none');
    input.classList.remove('redBoarder');
}

async function createTask() {
    let taskTitle = document.getElementById('addTaskTitle').value;
    let taskDescription = document.getElementById('addTaskDescription').value;
    let taskDueDate = document.getElementById('addTaskDueDate').value;
    let taskPrio = checkPrioStatus();
    let subtasks = [];

    loadSubtasks(taskPrio, subtasks);
    let assignedUsers = loadAssignedUsers();
    let group = loadChoosedCategory();

    tasks.push({ title: taskTitle, descr: taskDescription, group: group, users: assignedUsers, prio: taskPrio, deadline: taskDueDate, condit: 0, subTask: subtasks });
    await setItem('tasks', tasks);
    showOvlyTaskAdded()
    hideOvlyCard();
    if (typeof (render) != "undefined") { render(tasks) };
    //setTimeout(function () { clearTask() }, 2000);
}

function checkPrioStatus() {
    let taskPrio = +document.querySelector(".prioContainer input[type='radio']:checked");
    if (taskPrio != 0) return +document.querySelector(".prioContainer input[type='radio']:checked").value;
    else return taskPrio; // no Prio is located set Prio to LOW
}

function loadChoosedCategory() {
    let categoryName = document.getElementById('choosedCatagory').value;
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
        if (users[i].classList.contains('checked')) {
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
    categoryColoredDots.style = 'display:flex; justify-content:space-around;margin-block:10px -25px;';
}

function loadNewCategoryInput() {
    for (let i = 0; i < CATEGORY.length; i++) {
        const group = CATEGORY[i];

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
    colorChoosed.style.scale = '1.5';
}

async function saveNewCategory() {
    let newCategoryName = document.getElementById('newCategoryInput').value;
    let colorChoosed = document.querySelector('#categoryColoredDots input[type="radio"]:checked').value.toString();
    groups.push({ name: newCategoryName, color: colorChoosed });
    await setItem('groups', groups);
    loadCategory();
    closeNewCategory()

}

function chooseCategory(category) {
    document.getElementById('choosedCatagory').value = category;
    const selectBtn = document.querySelector('.categorySelectBtn');
    selectBtn.classList.toggle("open");
}

async function deletCategory(index) {
    groups.splice(index, 1);
    loadCategory();
}

function closeLists() {
    document.querySelector('.categorySelectBtn').classList.remove('open');
    document.querySelector('.userSelectBtn').classList.toggle('open');
}

function showOvlyTaskAdded() {
    if (document.getElementById('ovlyTaskaddedToBoard')) {
        document.getElementById('ovlyTaskaddedToBoard').classList.add("addAnimtaion");
        setTimeout(function () { document.getElementById('ovlyTaskaddedToBoard').classList.remove("addAnimtaion") }, 2000);
    }
}

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

function setMsg(idMsg, idInput) {
    document.getElementById(idMsg).classList.remove('d-none');
    document.getElementById(idInput).classList.add('redBoarder');
}


