import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated } from './javascript_helpers.js';

async function updateUserStatus() {
    const userStatusElement = document.getElementById('userStatus');
    const authArray = await authenticated();

    if (authArray[0] === true) {
        userStatusElement.textContent = `Authenticated as: ${authArray[1].email}`;
    } else {
        userStatusElement.textContent = "Not authenticated";
    }
}

async function login() {
    const email = document.getElementById('emailInput').value; 
    const password = document.getElementById('passwordInput').value;

    const { user, error } = await supa.auth.signIn({ email, password });

    if (error) {
        updateUserStatus();
        console.error("Error during SupaBase-SignIn: ", error.message);
        return false;
    } else {
        updateUserStatus();
        return true;
    }
}

updateUserStatus();

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const loginSuccess = await login();
    if (loginSuccess === true) {
        window.location.href = "/dashboard.html";
    }
});