import { supa } from "./SupaBaseClient/supabase.js";

console.log(window.location.origin);

async function sendMagicLink() {
    const email = document.getElementById('email').value;
    const { error } = await supa.auth.signIn({ email });
    
    if (error) {
        console.error("Error sending magic link: ", error.message);
    } else {
        console.log("Magic link sent to ", email);
    }
}

function updateUserStatus(user) {
    const parentDiv = document.getElementsByClassName('wrapper_status');
    const userStatusElement = document.getElementsByClassName('status-signal')[0];
    const childDiv = document.getElementsByClassName('wrapper_status')[0];

    if (user) {    
        userStatusElement.style.backgroundColor = 'var(--lightGreen)';

        const newDiv = document.createElement('div');
        newDiv.textContent = supa.auth.user();
        newDiv.className = 'txt';
        parentDiv.insertBefore(newDiv, childDiv.nextSibling);

        /* insert "Go to dashboard" - button */
    } 
    else {
        userStatusElement.style.backgroundColor = 'var(--lightRed)';
    }
}

const initialUser = supa.auth.user();
updateUserStatus(initialUser);

document.getElementById('buttonText').addEventListener('click', sendMagicLink);

supa.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
      updateUserStatus(session.user);
  } else if (event === "SIGNED_OUT") {
      updateUserStatus(null);
  }
});