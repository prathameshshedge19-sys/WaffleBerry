"use strict";

/* ==================================================
   ELEMENT REFERENCES
================================================== */

const authScreen =
    document.getElementById("authScreen");

const authMainVideo =
    document.getElementById("authMainVideo");

const authBackgroundVideo =
    document.getElementById("authBackgroundVideo");

const website =
    document.getElementById("website");

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

const logoutButton =
    document.getElementById("logoutButton");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const navLinks =
    document.querySelectorAll(".nav-link");

const pageSections =
    document.querySelectorAll(".page-section");

const typedHeading =
    document.getElementById("typedHeading");

const typedDescription =
    document.getElementById("typedDescription");

const startChatButton =
    document.getElementById("startChatButton");

const backHomeButton =
    document.getElementById("backHomeButton");

const missionChatButton =
    document.getElementById("missionChatButton");

const chatForm =
    document.getElementById("chatForm");

const chatInput =
    document.getElementById("chatInput");

const chatMessages =
    document.getElementById("chatMessages");

const typingIndicator =
    document.getElementById("typingIndicator");

const clearChatButton =
    document.getElementById("clearChatButton");

/* ==================================================
   PROTOTYPE LOGIN
================================================== */

let homepageAnimationStarted = false;

function enterWebsite() {
    loginMessage.textContent = "Signing you in...";

    window.setTimeout(() => {
        authScreen.classList.add("auth-hidden");

        website.classList.remove("website-locked");
        website.classList.add("website-unlocked");

        /*
        Pause the videos after login to save processing power.
        */
        authMainVideo.pause();
        authBackgroundVideo.pause();

        window.setTimeout(() => {
            authScreen.style.display = "none";
            startHomepageTyping();
        }, 800);
    }, 450);
}

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        loginMessage.textContent =
            "Please enter your email and password.";

        return;
    }

    /*
    Prototype only:
    Any non-empty email and password are accepted.
    */
    enterWebsite();
});

googleSignIn.addEventListener("click", () => {
    loginMessage.textContent =
        "Connecting with Google...";

    enterWebsite();
});

appleSignIn.addEventListener("click", () => {
    loginMessage.textContent =
        "Connecting with Apple...";

    enterWebsite();
});

createAccountButton.addEventListener("click", () => {
    loginMessage.textContent =
        "Account creation is enabled in prototype mode. Enter any email and password.";
});

togglePassword.addEventListener("click", () => {
    const passwordIsHidden =
        passwordInput.type === "password";

    passwordInput.type =
        passwordIsHidden ? "text" : "password";

    togglePassword.textContent =
        passwordIsHidden ? "🙈" : "👁";

    togglePassword.setAttribute(
        "aria-label",
        passwordIsHidden
            ? "Hide password"
            : "Show password"
    );
});

logoutButton.addEventListener("click", () => {
    website.classList.remove("website-unlocked");
    website.classList.add("website-locked");

    authScreen.style.display = "flex";

    window.setTimeout(() => {
        authScreen.classList.remove("auth-hidden");
    }, 20);

    emailInput.value = "";
    passwordInput.value = "";
    loginMessage.textContent = "";

    authMainVideo.currentTime = 0;
    authBackgroundVideo.currentTime = 0;

    authMainVideo.play().catch(() => {});
    authBackgroundVideo.play().catch(() => {});

    showSection("home");
});

/* ==================================================
   HOMEPAGE TYPING ANIMATION
================================================== */

const headingText =
    "Hello, I'm Berry.";

const descriptionText =
    "I preserve memories, stories and conversations so the people you love are never forgotten.";

function typeText(element, text, speed) {
    return new Promise((resolve) => {
        let index = 0;

        element.textContent = "";
        element.classList.add("typing-active");

        const interval =
            window.setInterval(() => {
                element.textContent +=
                    text.charAt(index);

                index += 1;

                if (index >= text.length) {
                    window.clearInterval(interval);

                    element.classList.remove(
                        "typing-active"
                    );

                    resolve();
                }
            }, speed);
    });
}

async function startHomepageTyping() {
    if (homepageAnimationStarted) {
        typedHeading.textContent =
            headingText;

        typedDescription.textContent =
            descriptionText;

        startChatButton.classList.add(
            "show-action"
        );

        return;
    }

    homepageAnimationStarted = true;

    await new Promise((resolve) => {
        window.setTimeout(resolve, 400);
    });

    await typeText(
        typedHeading,
        headingText,
        70
    );

    await new Promise((resolve) => {
        window.setTimeout(resolve, 200);
    });

    await typeText(
        typedDescription,
        descriptionText,
        28
    );

    await new Promise((resolve) => {
        window.setTimeout(resolve, 220);
    });

    startChatButton.classList.add(
        "show-action"
    );
}

/* ==================================================
   SECTION NAVIGATION
================================================== */

function showSection(sectionName) {
    pageSections.forEach((section) => {
        section.classList.remove(
            "active-section"
        );
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
    });

    const requestedSection =
        document.getElementById(
            `${sectionName}Section`
        );

    const requestedNavLink =
        document.querySelector(
            `.nav-link[data-section="${sectionName}"]`
        );

    if (requestedSection) {
        requestedSection.classList.add(
            "active-section"
        );
    }

    if (requestedNavLink) {
        requestedNavLink.classList.add(
            "active"
        );
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (sectionName === "chat") {
        window.setTimeout(() => {
            chatInput.focus();
        }, 350);
    }
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        showSection(link.dataset.section);
    });
});

startChatButton.addEventListener(
    "click",
    () => {
        showSection("chat");
    }
);

backHomeButton.addEventListener(
    "click",
    () => {
        showSection("home");
    }
);

missionChatButton.addEventListener(
    "click",
    () => {
        showSection("chat");
    }
);

/* ==================================================
   DARK AND LIGHT MODE
================================================== */

function applyTheme(themeName) {
    const isDark =
        themeName === "dark";

    document.body.classList.toggle(
        "dark-mode",
        isDark
    );

    themeIcon.textContent =
        isDark ? "☀️" : "🌙";

    themeToggle.setAttribute(
        "aria-label",
        isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
    );

    localStorage.setItem(
        "waffleBerryTheme",
        themeName
    );
}

const savedTheme =
    localStorage.getItem(
        "waffleBerryTheme"
    );

if (
    savedTheme === "dark" ||
    savedTheme === "light"
) {
    applyTheme(savedTheme);
}

themeToggle.addEventListener(
    "click",
    () => {
        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );

        applyTheme(
            isDark ? "light" : "dark"
        );
    }
);

/* ==================================================
   CHAT INTERFACE
================================================== */

function createUserMessage(messageText) {
    const row =
        document.createElement("div");

    row.className =
        "message-row user-row";

    const message =
        document.createElement("div");

    message.className =
        "message user-message";

    message.textContent =
        messageText;

    row.appendChild(message);

    return row;
}

function createBerryMessage(messageText) {
    const row =
        document.createElement("div");

    row.className =
        "message-row berry-row";

    const avatar =
        document.createElement("img");

    avatar.src =
        "assets/waffle-berry-mascot.png";

    avatar.alt = "";

    avatar.className =
        "message-avatar";

    const message =
        document.createElement("div");

    message.className =
        "message berry-message";

    message.textContent =
        messageText;

    row.appendChild(avatar);
    row.appendChild(message);

    return row;
}

function scrollChatToBottom() {
    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}

function showTypingIndicator() {
    typingIndicator.classList.add(
        "visible"
    );
}

function hideTypingIndicator() {
    typingIndicator.classList.remove(
        "visible"
    );
}

function generateBerryResponse(userMessage) {
    const message =
        userMessage.toLowerCase();

    if (
        message.includes("hello") ||
        message.includes("hi") ||
        message.includes("hey")
    ) {
        return (
            "Hello! I’m happy you’re here. " +
            "Whose story or memory would you like to preserve today?"
        );
    }

    if (
        message.includes("grandfather") ||
        message.includes("grandpa") ||
        message.includes("grandmother") ||
        message.includes("grandma")
    ) {
        return (
            "That sounds meaningful. Tell me one story, habit or phrase " +
            "you remember most clearly about your grandparent."
        );
    }

    if (
        message.includes("mother") ||
        message.includes("mom") ||
        message.includes("father") ||
        message.includes("dad") ||
        message.includes("family")
    ) {
        return (
            "Family memories often live in small details. " +
            "What is one moment with them that still makes you smile?"
        );
    }

    if (
        message.includes("sad") ||
        message.includes("miss") ||
        message.includes("lost") ||
        message.includes("died")
    ) {
        return (
            "I’m sorry this memory carries pain. We can take it gently. " +
            "What would you most want future generations to understand about that person?"
        );
    }

    return (
        "That sounds worth remembering. Tell me more about who was there, " +
        "what happened and how the moment made you feel."
    );
}

chatForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        const userMessage =
            chatInput.value.trim();

        if (!userMessage) {
            return;
        }

        chatMessages.appendChild(
            createUserMessage(userMessage)
        );

        chatInput.value = "";

        scrollChatToBottom();
        showTypingIndicator();

        window.setTimeout(() => {
            hideTypingIndicator();

            chatMessages.appendChild(
                createBerryMessage(
                    generateBerryResponse(
                        userMessage
                    )
                )
            );

            scrollChatToBottom();
        }, 1000);
    }
);

clearChatButton.addEventListener(
    "click",
    () => {
        chatMessages.innerHTML = `
            <div class="message-row berry-row">
                <img
                    src="assets/waffle-berry-mascot.png"
                    alt=""
                    class="message-avatar"
                >

                <div class="message berry-message">
                    The conversation has been cleared.
                    What memory would you like to preserve now?
                </div>
            </div>
        `;

        hideTypingIndicator();
        chatInput.focus();
    }
);