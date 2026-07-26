"use strict";

/* ==================================================
   HOME ELEMENT REFERENCES
================================================== */

const typedHeading =
    document.getElementById("typedHeading");

const typedDescription =
    document.getElementById("typedDescription");

const startChatButton =
    document.getElementById("startChatButton");


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
    if (
        !typedHeading ||
        !typedDescription ||
        !startChatButton
    ) {
        return;
    }

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
   START ANIMATION
================================================== */

startHomepageTyping();