import { supa } from "../SupaBaseClient/supabase.js";

async function login() {
    const email = document.getElementById('emailInput').value; 
    const password = document.getElementById('passwordInput').value;

    const { user, error } = await supa.auth.signIn({ email, password });

    if (error) {
        console.error("Error during login: ", error.message);
    } else {
        console.log("Logged in as ", user.email);
    }

    /* window.location.href='./dashboard.html'; */
}

function updateUserStatus(user) {
    const userStatusElement = document.getElementById('userStatus');

    if (user) {
        userStatusElement.textContent = `Authenticated as: ${user.email}`;
    } else {
        userStatusElement.textContent = "Not authenticated";
    }
}

const initialUser = supa.auth.user();
updateUserStatus(initialUser);

document.getElementById('loginButton').addEventListener('click', login);

supa.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
        console.log("User signed in: ", session.user);
        updateUserStatus(session.user);
    } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        updateUserStatus(null);
    }
});