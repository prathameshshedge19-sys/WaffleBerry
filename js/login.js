"use strict";

/* ==================================================
   LOGIN ELEMENT REFERENCES
================================================== */

const loginForm =
    document.getElementById("loginForm");

const fullNameGroup =
    document.getElementById("fullNameGroup");

const fullNameInput =
    document.getElementById("fullNameInput");

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

const authTitle =
    document.getElementById("authTitle");

const authDescription =
    document.getElementById("authDescription");

const authSubmitText =
    document.getElementById("authSubmitText");

const authTogglePrompt =
    document.getElementById("authTogglePrompt");

const loginMessage =
    document.getElementById("loginMessage");

let authMode = "login";


/* ==================================================
   AUTHENTICATION MODE
================================================== */

function setAuthMode(mode) {
    authMode = mode;

    const isRegisterMode =
        authMode === "register";

    if (fullNameGroup) {
        fullNameGroup.hidden =
            !isRegisterMode;
    }

    if (fullNameInput) {
        fullNameInput.required =
            isRegisterMode;
    }

    if (authTitle) {
        authTitle.textContent =
            isRegisterMode
                ? "Create your account"
                : "Welcome back";
    }

    if (authDescription) {
        authDescription.textContent =
            isRegisterMode
                ? "Join Waffle Berry to preserve your memories and conversations."
                : "Sign in to continue your memories and conversations with Berry.";
    }

    if (authSubmitText) {
        authSubmitText.textContent =
            isRegisterMode
                ? "Create Account"
                : "Sign in";
    }

    if (authTogglePrompt) {
        authTogglePrompt.textContent =
            isRegisterMode
                ? "Already have an account?"
                : "Don't have an account?";
    }

    if (createAccountButton) {
        createAccountButton.textContent =
            isRegisterMode
                ? "Sign In"
                : "Create Account";
    }

    if (passwordInput) {
        passwordInput.autocomplete =
            isRegisterMode
                ? "new-password"
                : "current-password";
    }

    if (loginMessage) {
        loginMessage.textContent = "";
    }
}

setAuthMode("login");


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
        async (event) => {
            event.preventDefault();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value.trim();

            const isRegisterMode =
                authMode === "register";

            const fullName =
                fullNameInput
                    ? fullNameInput.value.trim()
                    : "";

            if (
                !email ||
                !password ||
                (isRegisterMode && !fullName)
            ) {
                if (loginMessage) {
                    loginMessage.textContent =
                        isRegisterMode
                            ? "Please enter your full name, email and password."
                            : "Please enter your email and password.";
                }

                return;
            }

            if (loginMessage) {
                loginMessage.textContent =
                    isRegisterMode
                        ? "Creating your account..."
                        : "Signing you in...";
            }

            try {
                const endpoint =
                    isRegisterMode
                        ? "http://127.0.0.1:8000/api/v1/users"
                        : "http://127.0.0.1:8000/api/v1/login";

                const requestBody =
                    isRegisterMode
                        ? {
                            full_name: fullName,
                            email,
                            password
                        }
                        : {
                            email,
                            password
                        };

                const response = await fetch(
                    endpoint,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(
                            requestBody
                        )
                    }
                );

                const responseText =
                    await response.text();

                let responseData;

                try {
                    responseData =
                        JSON.parse(responseText);
                } catch {
                    responseData = null;
                }

                if (!response.ok) {
                    const backendError =
                        responseData?.detail ||
                        responseData?.message ||
                        responseText ||
                        (
                            isRegisterMode
                                ? "Unable to create your account."
                                : "Unable to sign you in."
                        );

                    throw new Error(
                        typeof backendError === "string"
                            ? backendError
                            : JSON.stringify(backendError)
                    );
                }

                if (!isRegisterMode) {
                    const accessToken =
                        responseData?.access_token;

                    const tokenType =
                        responseData?.token_type;

                    const currentUser =
                        responseData?.user;

                    if (
                        !accessToken ||
                        tokenType !== "bearer" ||
                        !currentUser
                    ) {
                        throw new Error(
                            "Unable to sign you in."
                        );
                    }

                    localStorage.setItem(
                        "accessToken",
                        accessToken
                    );

                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(currentUser)
                    );
                }

                enterWebsite();
            } catch (error) {
                if (!isRegisterMode) {
                    localStorage.removeItem(
                        "accessToken"
                    );

                    localStorage.removeItem(
                        "currentUser"
                    );
                }

                if (loginMessage) {
                    loginMessage.textContent =
                        error.message;
                }
            }
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
            setAuthMode(
                authMode === "login"
                    ? "register"
                    : "login"
            );
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
