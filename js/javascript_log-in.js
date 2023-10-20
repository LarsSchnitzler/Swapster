import { supa } from "../SupaBaseClient/supabase.js";

console.log(window.location.origin);

async function sendMagicLink() {
    const email = document.getElementById('email').value;
    const { error } = await supa.auth.signIn({email}); //the signIn method of the auth object returns an object that contains an error property. By using object destructuring (const {error}), we can extract the error property from the returned object and assign it to a variable named error

    if (error) {
        console.error("Error sending magic link: ", error.message);
    } else {
        console.log("Magic link sent to ", email);
    }
}

async function signInWithEmailAndPassword(email, password) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

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

        const newDiv = document.createElement('div');
        newDiv.textContent = supa.auth.user();
        newDiv.className = 'txt';
        parentDiv.insertBefore(newDiv, childDiv.nextSibling);

        const button = document.getElementById('LoginButton');
        button.textContent = 'Go to dashboard';
        button.setAttribute('href', './dashboard.html');
    } 
    else {
        userStatusElement.style.backgroundColor = 'var(--lightRed)';
        console.log(supa.auth.user());
        
    }
}

const initialUser = supa.auth.user();
updateUserStatus(initialUser);

document.getElementById('LoginButton').addEventListener('click', signInWithEmailAndPassword);

/* 
supa.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
      updateUserStatus(session.user);
  } else if (event === "SIGNED_OUT") {
      updateUserStatus(null);
  }
}); */