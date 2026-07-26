"use strict";

/* ==================================================
   CHAT ELEMENT REFERENCES
================================================== */

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
   CHAT MESSAGE CREATION
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


/* ==================================================
   CHAT HELPERS
================================================== */

function scrollChatToBottom() {
    if (!chatMessages) {
        return;
    }

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


function showTypingIndicator() {
    if (!typingIndicator) {
        return;
    }

    typingIndicator.classList.add(
        "visible"
    );
}


function hideTypingIndicator() {
    if (!typingIndicator) {
        return;
    }

    typingIndicator.classList.remove(
        "visible"
    );
}


/* ==================================================
   PROTOTYPE BERRY RESPONSES
================================================== */

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


/* ==================================================
   SEND MESSAGE
================================================== */

if (
    chatForm &&
    chatInput &&
    chatMessages
) {
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
}


/* ==================================================
   CLEAR CONVERSATION
================================================== */

if (
    clearChatButton &&
    chatMessages
) {
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

            if (chatInput) {
                chatInput.focus();
            }
        }
    );
}