let progressCount = 0;
let awaitingCount = 0;
let prioCount = 0;
let toDoCount = 0;
let doneCount = 0;
let deadlineCount = [];
let today = new Date;

let allTasksCount;
let tasksProgressCount;
let tasksAwaitingCount;
let urgentCount;
let urgentDeadlineDate;
let taskToDoCount;
let taskDoneCount;
let greetingUser;
let username;


/**
 * Initializes the "Summary" tab, retrieves necessary elements, sets counters, displays user greetings,
 * and arranges elements based on deadlines.
 *
 */
async function summaryInit() {
    await init('tabsummary');
    getElements();
    setCounters();
    greetingUser.innerHTML = greetingText();
    if (USER) getUserName(USER);
    deadlineCount.sort((a, b) => { return a - b });
    setElements();
}

/**
 * Retrieves and assigns references to various HTML elements used in the "Summary" tab.
 *
 */
function getElements() {
    allTasksCount = document.getElementById('allTasksCount');
    tasksProgressCount = document.getElementById('tasksProgressCount');
    tasksAwaitingCount = document.getElementById('tasksAwaitingCount');
    urgentCount = document.getElementById('urgentCount');
    urgentDeadlineDate = document.getElementById('urgentDeadlineDate');
    taskToDoCount = document.getElementById('toDoCount');
    taskDoneCount = document.getElementById('doneCount');
    greetingUser = document.getElementById('greetingText');
    username = document.getElementById('greetingName');
}

/**
 * Sets counters and updates information based on the tasks in the "Summary" tab.
 *
 */
function setCounters() {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        upcommingDeadline = (task['deadline']);
        increaseCondit(task.condit);
        if (task.prio == "2") setPrio();
    }
}
/**
 * Increases counters based on the condition of a task.
 *
 * @function
 * @param {number} condit - The condition of the task (0 for to-do, 1 for in progress, 2 for awaiting, 3 for done).
 */
function increaseCondit(condit) {
    switch (condit) {
        case 0:
            toDoCount += 1;
            break;
        case 1:
            progressCount += 1;
            break;
        case 2:
            awaitingCount += 1;
            break;
        case 3:
            doneCount += 1;
            break;
        default:
            break;
    }
}
/**
 * Updates counters and maintains a list of deadlines for tasks with high priority.
 *
 */
function setPrio() {
    prioCount += 1;
    let dates = new Date(upcommingDeadline)
    deadlineCount.push(dates);
}

/**
 * Retrieves the name of a user based on their user ID and updates the greeting and username elements.
 *
 * @function
 * @async
 * @param {number} userId - The ID of the user for whom to retrieve the name.
 * @returns {Promise<void>} - A Promise that resolves after updating the greeting and username elements.
 */
async function getUserName(userId) {
    let users = await getItem('users');
    greetingUser.innerHTML += ',';
    username.innerHTML = users[userId - 1]['name'];
}

/**
 * Generates a greeting based on the current time of day.
 *
 * @function
 * @returns {string} - A greeting message corresponding to the time of day.
 */
function greetingText() {
    if (today.getHours() >= 0 && today.getHours() <= 12) return 'Good morning'
    if (today.getHours() > 12 && today.getHours() <= 18) return 'Hey'
    if (today.getHours() > 18 && today.getHours() <= 24) return 'Good evening'
}

/**
 * Sets the inner HTML content of various elements based on task-related counters and data.
 *
*/
function setElements() {
    allTasksCount.innerHTML = tasks.length;
    tasksProgressCount.innerHTML = progressCount;
    tasksAwaitingCount.innerHTML = awaitingCount;
    urgentCount.innerHTML = prioCount;
    taskToDoCount.innerHTML = toDoCount;
    taskDoneCount.innerHTML = doneCount;
    urgentDeadlineDate.innerHTML = deadlineCount[0].toLocaleDateString('en-GB', { year: "numeric", month: "long", day: "2-digit" });
}