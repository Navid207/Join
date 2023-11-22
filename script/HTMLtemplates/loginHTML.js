// log in related templates

/**
 * Generates HTML markup for a login form.
 *
 * @returns {string} The HTML markup for the login form.
 */
function loginHTML() {
    return /*html*/`
    <h1>Log in</h1>
    <div id="underline"></div>
    <form onsubmit="login(); return false">
        <input type="email" id="email" name="Email" placeholder="Email" required>
        <div class="pwd-input" onmouseleave="hidePwd('pwd')">
                <input onclick="showPwdBg('pwd')" type="password" id="pwd" name="Password" placeholder="Password" autocomplete="off" required>
                <div onclick="togglPwd('pwd')"></div>
        </div>
        <span id="msgPwd"></span>
        <div class="pwd-ext">
            <input type="checkbox" name="Remember" id="saveLogin">
            <label for="saveLogin">Remember me</label>
            <a onclick="renderHTML('content',PwdHTML());hideElementID('signUp')">Forgot my password</a>
        </div>
        <div class="but-area">
            <button class="but-dark">Log in</button>
            <button class="but-light" onclick="loginGuest()">Guest Log in</button>
        </div>
    </form>
`
}

/**
 * Generates HTML markup for a signup form.
 *
 * @returns {string} The HTML markup for the signup form.
 */
function SingupHTML() {
    return /*html*/`
    <img class="arrow-back" src="./img/icons/arrow_left_line.svg" alt="Join Logo" onclick="renderHTML('content',loginHTML()); showElementID('signUp')">
    <h1>Sign up</h1>
    <div id="underline"></div>
    <form onsubmit="checkSignIn(); return false">
        <input type="name" id="name" name="Name" placeholder="Name Lastname" pattern="[A-ZÄÖÜ][a-zäöüß]{1,} [A-ZÄÖÜ][a-zäöüß]{1,}" title="Name Lastname" required>
        <span id="msgName"></span>
        <input type="email" id="email" name="Email" placeholder="Email" required>
        <span id="msgEmail"></span>
        <div class="pwd-input" onmouseleave="hidePwd('pwd')">
            <input onclick="showPwdBg('pwd')" type="password" id="pwd" name="Password" placeholder="Password" minlength="8" autocomplete="off" required>
            <div onclick="togglPwd('pwd')"></div>
        </div>
        <div class="pwd-input" onmouseleave="hidePwd('pwdCon')">
            <input onclick="showPwdBg('pwdCon')" type="password" id="pwdCon" name="Password" placeholder="Password" minlength="8" autocomplete="off" required>
            <div onclick="togglPwd('pwdCon')"></div>
        </div>
        <span id="msgPwd"></span>
        <button class="but-dark" type="submit">Sign up</button>          
    </form>
`
}

/**
 * Generates HTML markup for a password recovery form.
 *
 * @returns {string} The HTML markup for the password recovery form.
 */
function PwdHTML() {
    return /*html*/`
    <img class="arrow-back" src="./img/icons/arrow_left_line.svg" alt="Join Logo" onclick="renderHTML('content',loginHTML()); showElementID('signUp')">
    <h1>I forgot my password</h1>
    <div id="underline"></div>
    <p>Don't worry! We will send you an email with the istructions to reset your password.</p>
    <form> <!-- action="https://join-615.developerakademie.net/php/send_mail_change_pwd.php" method="POST" -->
        <input type="email" id="email" name="Email" placeholder="Email" required>
        <span id="msgMail"></span>
        <button class="but-dark" onclick ="forgotPwd()" >Send me the email</button>
    </form>
`
}

/**
 * Generates HTML markup for a message indicating that an email has been sent.
 *
 * @returns {string} The HTML markup for the email sent message.
 */
function SendMailHTML() {
    return /*html*/`
    <div class="ovlyMsg">
        <div>
            <img src="./img/icons/send_mail.svg" alt="send e-mail">
            <span>An E-Mail has been sent to you</span>
        </div>
    </div>
`
}

/**
 * Generates HTML markup for a message indicating that the password has been reset.
 *
 * @returns {string} The HTML markup for the password reset message.
 */
function ChangePwdHTML() {
    return /*html*/`
    <div class="ovlyMsg">
        <div>
            <span>You reset your password</span>
        </div>
    </div>
`
}