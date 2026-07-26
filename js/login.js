"use strict";

/* ==================================================
   LOGIN ELEMENT REFERENCES
================================================== */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("emailInput");

const passwordInput =
    document.getElementById("passwordInput");

const togglePassword =
    document.getElementById("togglePassword");

const googleSignIn =
    document.getElementById("googleSignIn");

const appleSignIn =
    document.getElementById("appleSignIn");

const createAccountButton =
    document.getElementById("createAccountButton");

const loginMessage =
    document.getElementById("loginMessage");


/* ==================================================
   ENTER WEBSITE
================================================== */

function enterWebsite() {
    if (loginMessage) {
        loginMessage.textContent =
            "Signing you in...";
    }

    window.setTimeout(() => {
        window.location.href =
            "home.html";
    }, 700);
}


/* ==================================================
   EMAIL AND PASSWORD LOGIN
================================================== */

if (
    loginForm &&
    emailInput &&
    passwordInput
) {
    loginForm.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value.trim();

            if (!email || !password) {
                if (loginMessage) {
                    loginMessage.textContent =
                        "Please enter your email and password.";
                }

                return;
            }

            /*
             Prototype login:
             Any non-empty email and password are accepted.
            */

            enterWebsite();
        }
    );
}


/* ==================================================
   GOOGLE LOGIN
================================================== */

if (googleSignIn) {
    googleSignIn.addEventListener(
        "click",
        () => {
            if (loginMessage) {
                loginMessage.textContent =
                    "Connecting with Google...";
            }

            enterWebsite();
        }
    );
}


/* ==================================================
   APPLE LOGIN
================================================== */

if (appleSignIn) {
    appleSignIn.addEventListener(
        "click",
        () => {
            if (loginMessage) {
                loginMessage.textContent =
                    "Connecting with Apple...";
            }

            enterWebsite();
        }
    );
}


/* ==================================================
   CREATE ACCOUNT
================================================== */

if (createAccountButton) {
    createAccountButton.addEventListener(
        "click",
        () => {
            if (loginMessage) {
                loginMessage.textContent =
                    "Account creation is enabled in prototype mode. Enter any email and password.";
            }
        }
    );
}


/* ==================================================
   SHOW OR HIDE PASSWORD
================================================== */

if (
    togglePassword &&
    passwordInput
) {
    togglePassword.addEventListener(
        "click",
        () => {
            const passwordIsHidden =
                passwordInput.type ===
                "password";

            passwordInput.type =
                passwordIsHidden
                    ? "text"
                    : "password";

            togglePassword.textContent =
                passwordIsHidden
                    ? "🙈"
                    : "👁";

            togglePassword.setAttribute(
                "aria-label",
                passwordIsHidden
                    ? "Hide password"
                    : "Show password"
            );
        }
    );
}