import { supa } from "../SupaBaseClient/supabase.js";

async function signInWithEmailAndPassword() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("read email and password");

    const { user, error } = await supa.auth.signIn({
      email: email,
      password: password
    });
  
    if (error) {
      console.log('Error signing in:', error.message);
    } else {
      console.log('Signed in successfully:', user);
    }
  }

function updateUserStatus(user) {
    const parentDiv = document.querySelector('.wrapper_status');
    const userStatusElement = document.querySelector('.status-signal');
    const childDiv = document.querySelector('.wrapper_status .txt');

    if (user) {    
        userStatusElement.style.backgroundColor = 'var(--lightGreen)';

        //Creates div with userEmail in it
        const newDiv = document.createElement('div');
        newDiv.textContent = `The following UserEmail is logged in: ${user.email}`;
        newDiv.className = 'txt';
        parentDiv.insertBefore(newDiv, childDiv.nextSibling);

        //Changes the loginButtons Content and href to Dashboard
        const button = document.getElementById('LoginButton');
        button.textContent = 'Go to dashboard';
        button.setAttribute('href', './dashboard.html');
        console.log('User logged in1');
    } 
    else {
        userStatusElement.style.backgroundColor = 'var(--lightRed)';
        console.log('No User logged in');
    }
}

//checks wether user is already in localStorage
const initialUser = supa.auth.user();
updateUserStatus(initialUser);

//Makes it so that when LoginButton is pressed, supa.auth.signIn is executed
document.getElementById('LoginButton').addEventListener('click', signInWithEmailAndPassword);

/* Checks seemingly redunantly, trough the supa.auth.onAuthStateChange - Method, wether Authentication-State has changed. (could have been done in the signIn-Function instead) 
This is done so that you don't have to execute updateUserStatus() in a logoutfunction, for example. */
supa.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
      updateUserStatus(session.user);
      console.log('User logged in0');
  } else if (event === "SIGNED_OUT") {
      updateUserStatus(null);
  }
});