"use strict";

/* ==================================================
   AUTHENTICATION GUARD
================================================== */

(function guardProtectedPage() {
    let isLocallyAuthenticated = false;

    try {
        const accessToken =
            localStorage.getItem("accessToken");

        const currentUser =
            localStorage.getItem("currentUser");

        const hasAccessToken =
            typeof accessToken === "string" &&
            accessToken.trim() !== "";

        const hasCurrentUser =
            currentUser !== null;

        if (hasAccessToken && hasCurrentUser) {
            JSON.parse(currentUser);
            isLocallyAuthenticated = true;
        }
    } catch {
        isLocallyAuthenticated = false;
    }

    if (!isLocallyAuthenticated) {
        try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("currentUser");
        } finally {
            window.location.replace("login.html");
        }
    }
})();

/* ==================================================
   LOGOUT
================================================== */

function logout() {
    try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
    } finally {
        window.location.replace("login.html");
    }
}


document.addEventListener(
    "DOMContentLoaded",
    () => {
        const logoutButtons =
            document.querySelectorAll(
                ".logout-button"
            );

        logoutButtons.forEach((logoutButton) => {
            logoutButton.addEventListener(
                "click",
                (event) => {
                    event.preventDefault();
                    logout();
                }
            );
        });
    }
);