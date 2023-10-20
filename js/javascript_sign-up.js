import { supa } from "../SupaBaseClient/supabase.js";

//Funtion that reads all other inputs and writes it into the profiles table

async function signUpWithEmailAndPassword() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { user, error } = await supa.auth.signUp({email: email, password: password});

    if (error) {
    console.log('Error signing up:', error.message);
    } else {
    console.log('Signed up successfully:', user);
    }
}

/* async function logout() {                                     //no logout Button existing in this file yet
    const { error } = await supa.auth.signOut();
    if (error) {
        console.error("Error during logout:", error);
    } else {
        updateUserStatus(null);
        console.log("User logged out successfully.");
    }
} */

function updateUserStatus(user) {                                //no userStatus Signal existing in this file
    const userStatusElement = document.getElementById('userStatus');

    if (user) {
        const button = document.getElementById('sign-up-button');
        button.textContent = 'Go to dashboard';
        button.setAttribute('href', './dashboard.html');
    } else {
        console.log("No User logged in");
    }
} 

const initialUser = supa.auth.user();
updateUserStatus(initialUser);

// Check wether Terms Checkbox is checked an nest the signUp-function in the if-Clause, else alert "Please accept our Terms and Conditions"
document.getElementById('sign-up-button').addEventListener('click', signUpWithEmailAndPassword);

/* supa.auth.onAuthStateChange((event, session) => {                //no userStatus Signal and logout Button existing in this file
    if (event === "SIGNED_IN") {
        console.log("User signed in: ", session.user);
        updateUserStatus(session.user);
    } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        updateUserStatus(null);
    }
});
 */
//document.getElementById('logoutButton').addEventListener('click', logout);




















