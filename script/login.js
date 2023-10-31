let LoginHTML = /*html*/`
        <h1>Log in</h1>
        <div id="underline"></div>
        <form onsubmit="login(); return false">
            <input type="email" id="email" name="Email" placeholder="Email" required>
            <div class="pwd-input" onmouseleave="hidePwd('pwd')">
                    <input onclick="showPwdBg('pwd')" type="password" id="pwd" name="Password" placeholder="Password" required>
                    <div onclick="togglPwd('pwd')"></div>
            </div>
            <span id="msgPwd"></span>
            <div class="pwd-ext">
                <input type="checkbox" name="Remember" id="saveLogin">
                <label for="saveLogin">Remember me</label>
                <a onclick="renderHTML('content',PwdHTML);hideElementID('signUp')">Forgot my password</a>
            </div>
            <div class="but-area">
                <button class="but-dark">Log in</button>
                <button class="but-light" onclick="loginGuest()">Guest Log in</button>
            </div>
        </form>
`;
let SingupHTML =/*html*/`
        <img class="arrow-back" src="./img/icons/arrow_left_line.svg" alt="Join Logo" onclick="renderHTML('content',LoginHTML); showElementID('signUp')">
        <h1>Sign up</h1>
        <div id="underline"></div>
        <form onsubmit="checkPwd(addUser()); return false">
            <input type="name" id="name" name="Name" placeholder="Name Lastname" pattern="[A-ZÄÖÜ][a-zäöüß]{1,} [A-ZÄÖÜ][a-zäöüß]{1,}" title="Name Lastname" required>
            <span id="msgName"></span>
            <input type="email" id="email" name="Email" placeholder="Email" required>
            <span id="msgEmail"></span>
            <div class="pwd-input" onmouseleave="hidePwd('pwd')">
                    <input onclick="showPwdBg('pwd')" type="password" id="pwd" name="Password" placeholder="Password" minlength="8" required>
                    <div onclick="togglPwd('pwd')"></div>
            </div>
            <div class="pwd-input" onmouseleave="hidePwd('pwdCon')">
                    <input onclick="showPwdBg('pwdCon')" type="password" id="pwdCon" name="Password" placeholder="Password" minlength="8" required>
                    <div onclick="togglPwd('pwdCon')"></div>
            </div>
            <span id="msgPwd"></span>
            <button class="but-dark" type="submit">Sign up</button>          
        </form>
`;
let PwdHTML = /*html*/`
        <img class="arrow-back" src="./img/icons/arrow_left_line.svg" alt="Join Logo" onclick="renderHTML('content',LoginHTML); showElementID('signUp')">
        <h1>I forgot my password</h1>
        <div id="underline"></div>
        <p>Don't worry! We will send you an email with the istructions to reset your password.</p>
        <form action="https://join-615.developerakademie.net/php/send_mail_change_pwd.php" method="POST"> 
            <input type="email" id="email" name="Email" placeholder="Email" required>
            <span id="msgMail"></span>
            <button class="but-dark" onclick ="forgotPwd()" >Send me the email</button>
        </form>
`;
let SendMailHTML = /*html*/`
    <div class="ovlyMsg">
        <div>
            <img src="./img/icons/send_mail.svg" alt="send e-mail">
            <span>An E-Mail has been sent to you</span>
        </div>
    </div>
`;
let ChangePwdHTML = /*html*/`
    <div class="ovlyMsg">
        <div>
            <span>You reset your password</span>
        </div>
    </div>
`;

/**
 * Renders HTML content to a specified element with the given ID.
 *
 * @param {string} id - The ID of the target element where the HTML will be rendered.
 * @param {string} HTML - The HTML content to be rendered.
 */
function renderHTML(id, HTML) {
    let contentBox = document.getElementById(id);
    contentBox.innerHTML = HTML;
}

/**
 * Toggles the visibility of a password input field between "password" and "text" and updates its background.
 *
 * @param {string} id - The ID of the password input element to toggle.
 */
function togglPwd(id) {
    let element = document.getElementById(id);
    let type = element.getAttribute('type') === 'password' ? 'text' : 'password';
    element.setAttribute('type', type);
    element.focus();
    showPwdBg(id);
}

/**
 * Updates the background of a password input field based on its visibility status.
 *
 * @param {string} id - The ID of the password input element to update the background for.
 */
function showPwdBg(id) {
    let element = document.getElementById(id);
    let type = element.getAttribute('type');
    if (type === 'password') element.setAttribute("style", "background-image:url(./img/icons/visibility_on.svg);");
    else element.setAttribute("style", "background-image:url(./img/icons/visibility_off.svg);");
}

/**
 * Hides the visibility of a password input field and updates its background.
 *
 * @param {string} id - The ID of the password input element to hide.
 */
function hidePwd(id) {
    let element = document.getElementById(id);
    element.setAttribute('type', 'password');
    element.setAttribute("style", "background-image:url(./img/icons/lock.svg);")
    element.blur()
}

//------------------------------------------------

// this part should be in the backend
let users = [];

/**
 * Asynchronously initializes the login process by fetching user data and contact list.
 *
 * @returns {Promise<void>} - A Promise that resolves when the initialization is complete.
 */
async function initLogin() {
    users = await getItem('users');
    mapUsers();
    contactListSorted = await getItem('contacts');
    loadLogin();
    checkState();
}

/**
 * Maps the existing user data to a new array of User objects with updated properties.
 */
function mapUsers() {
    users = users.map(user => new User(user.name, user.email, user.pwd, user.id));
}

/**
 * Checks if the passwords match and either returns a specified function or displays an error message.
 *
 * @param {Function} doFunction - The function to return or execute if the passwords match.
 * @returns {void|Function} - If passwords match, returns the specified function; otherwise, displays an error message.
 */
function checkPwd(doFunction) {
    let pwd1 = document.getElementById('pwd');
    let pwd2 = document.getElementById('pwdCon');
    if (pwd1.value === pwd2.value) return doFunction;
    else return addMsg('pwdCon', 'msgPwd', 'Password confirmation is wrong!');
}

/**
 * Adds a new user to the system if the email is unique; otherwise, displays an error message.
 */
function addUser() {
    let newUser = getUserFromDocument();
    if (!users.find(u => u.email == newUser.email)) return addUserToData(newUser);
    else addMsg('email', 'msgEmail', 'Email already exists!');
}

/**
 * Retrieves user information from the document and creates a new User object.
 *
 * @returns {User} - A User object containing the user's name, email, and password.
 */
function getUserFromDocument() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let pwd = document.getElementById('pwd').value;
    return new User(name, email, pwd)
}

/**
 * Adds a new user to the data, updates the user ID, saves the data, sends a welcome email,
 * initiates the login process, and renders the login UI (User Interface).
 *
 * @param {Object} user - The user object to be added to the data.
 * @property {string} user.name - The name of the user.
 * @property {string} user.email - The email of the user.
 * @property {string} user.pwd - The password of the user.
 */
async function addUserToData(user) {
    user.id = users.length + 1;
    users.push(user);
    setItem('users', users);
    sendWelcomMail(user);
    await initLogin();
    renderLogin();
}

/**
 * Sends a welcome email to the specified user by making a POST request to a remote server.
 *
 * @param {Object} user - The user object to whom the welcome email will be sent.
 * @property {string} user.name - The name of the user.
 * @property {string} user.email - The email of the user.
 */
function sendWelcomMail(user) {
    const data = JSON.stringify({ name: user.name, mail: user.email });
    fetch("https://join-615.developerakademie.net/php/send_mail_add_user.php", { method: 'POST', body: data });
}

/**
 * Renders the login UI (User Interface) by updating the HTML content of specified elements and showing/hiding elements.
 */
function renderLogin() {
    renderHTML('content', LoginHTML);
    showElementID('signUp');
    renderHTML('hidden', SendMailHTML);
}

/**
 * function to check the Login 
 */
function login() {
    let user = checkUser();
    user ? loginSuccess(user) : addMsg('pwd', 'msgPwd', 'Ups, wrong password! Try again.');
}

/**
 * Checks user credentials by creating a temporary user object with email and password from the document,
 * and then finding a matching user in the existing user data.
 *
 * @returns {User|null} - If a matching user is found, returns the user object; otherwise, returns null.
 */
function checkUser() {
    let loginUser = new User;
    loginUser.email = document.getElementById('email').value;
    loginUser.pwd = document.getElementById('pwd').value;
    return users.find(u => u.email == loginUser.email && u.pwd == loginUser.pwd);
}

/**
 * Redirects the user to the summary page.
 * Safely logs in the user and redirects the user to the summary page with the user's ID as a query parameter.
 *
 * @param {Object} user - The user object representing the logged-in user.
 * @property {string} user.id - The unique identifier of the user.
 */
function loginSuccess(user) {
    safeLogin(JSON.stringify(user));
    window.location.href = 'pages/summary.html' + '?user=' + user.id;
}

/**
 * Redirects the user to the summary page as a guest.
 */
function loginGuest() {
    window.location.href = 'pages/summary.html';
}

/**
 * Safely manages user login information in local storage based on the user's preference.
 *
 * @param {string} user - The serialized user information to be stored in local storage.
 */
function safeLogin(user) {
    let save = document.getElementById('saveLogin');
    save.checked ? localStorage.setItem('User', user) : localStorage.removeItem('User');
}

/**
 * Loads user login information from local storage and populates the login form if available.
 */
function loadLogin() {
    let user = JSON.parse(localStorage.getItem('User'));
    if (user) {
        document.getElementById('email').value = user['email'];
        document.getElementById('pwd').value = user['pwd'];
        document.getElementById('saveLogin').checked = true;
    }
}

/**
 * Initiates the process for password recovery. 
 * Checks if the entered email exists in the user data, 
 * renders the appropriate HTML content, and displays relevant messages.
 */
function forgotPwd() {
    let email = document.getElementById('email');
    if (users.find(u => u.email == email.value)) {
        renderHTML('hidden', SendMailHTML);
        renderHTML('content', LoginHTML);
        showElementID('signUp');
    } else addMsg('email', 'msgMail', 'Email not exist!');
}

/**
 * Checks the state of the URL parameters and performs actions based on the state.
 */
function checkState() {
    const msg = URL_PARAMS.get('msg');
    if (msg == 'send_Mail') {
        renderHTML('hidden', SendMailHTML);
        hideElementID('SendMailHTML');
    }
}

/**
 * Changes the password for a user based on the provided email in the URL parameters.
 * Updates the user data, renders HTML content, and redirects to the start page after a delay.
 */
async function changePassword() {
    const mail = URL_PARAMS.get('mail');
    let userID = findIndexByValue('email', mail, users);
    users[userID]['pwd'] = document.getElementById('pwd').value;
    setItem('users', users);
    renderHTML('hidden', ChangePwdHTML);
    setTimeout(function () { goToStartPage(); }, 2000);
}

/**
 * Redirects the user to the Log in page.
 */
function goToStartPage() {
    window.location = '../index.html';
}

//------------------------------------------------

// move later to main.js!

/**
 * Hides an HTML element with the specified ID by adding the 'display-none' class.
 *
 * @param {string} elementID - The ID of the HTML element to hide.
 */
function hideElementID(ElementID) {
    document.getElementById(ElementID).classList.add('display-none');
}
/**
 * Shows an HTML element with the specified ID by removing the 'display-none' class.
 *
 * @param {string} elementID - The ID of the HTML element to show.
 */
function showElementID(ElementID) {
    document.getElementById(ElementID).classList.remove('display-none');
}
/**
 * Adds an error message for a specified input field and clears its value.
 *
 * @param {string} inpID - The ID of the input field to which the error message is associated.
 * @param {string} msgID - The ID of the element where the error message will be displayed.
 * @param {string} msgString - The error message string to be displayed.
 */
function addMsg(inpID, msgID, msgString) {
    let inp = document.getElementById(inpID);
    inp.classList.add('border-wrg');
    inp.value = '';
    document.getElementById(msgID).innerHTML = msgString;
}