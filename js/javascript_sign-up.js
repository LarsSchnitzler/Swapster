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

function updateUserStatus(user) {                              
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

// Check wether Terms Checkbox is checked AND all other fields are filled out, and nest the signUp-function in the if-Clause, else alert the user to fill out all fields and check the checkbox 
document.getElementById('sign-up-button').addEventListener('click', signUpWithEmailAndPassword);