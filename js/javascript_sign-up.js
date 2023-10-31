import { supa } from "../SupaBaseClient/supabase.js";

function createProfilesEntry(firstName, lastName, dob){
    //get userId from userobject
    //write firstName, lastName, dob, userId into new Profiles Entry
}

async function signUpWithEmailAndPassword() {
    const checkboxElement = document.getElementById(/* 'checkbox' */).value;
    const InputElement_firstName = document.getElementById(/* 'InputElement_firstName' */).value;
    const InputElement_lastName = document.getElementById(/* 'InputElement_lastName' */).value;
    const InputElement_dob = document.getElementById(/* 'InputElement_dob' */).value;

    const inputComplete = true;

    if ((InputElement_firstName === null) or (InputElement_firstName === null) or (InputElement_firstName === null)) {
        const inputComplete = false;
    }

    if (checkboxElement && inputComplete) {
        const emailElement = document.getElementById('email').value;
        const passwordElement = document.getElementById('password').value;
        const { user, error } = await supa.auth.signUp({emailElement, passwordElement});
    
        if (error) {
        console.log('Error signing up:', error.message);
        } else {
        console.log('Signed up successfully:', user);
        }

        createProfilesEntry(InputElement_firstName, InputElement_lastName, dob);
        
        window.location.href='./dashboard.html';
    }
    else if ((inputComplete === false) && (checkboxElement === true)){
        //alert input is missing
    else if ((inputComplete === true) && (checkboxElement === false)){
        //alert checkbox is missing
    }
    else {
        //alert many missing required fields
    }
}

document.getElementById('sign-up-button').addEventListener('click', signUpWithEmailAndPassword);