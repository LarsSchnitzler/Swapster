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

    const { data, error } = await supa.auth.signIn({ email, password });

    if (error) {
        updateUserStatus();
        console.error("Error during SupaBase-SignIn: ", error.message);

        //show error message in div
            let newDiv = document.createElement('div');

            newDiv.className = 'txt';

            newDiv.textContent = error.message;

            newDiv.style.position = 'absolute';
            newDiv.style.bottom = '20%';
            newDiv.style.color = 'red';

            // Add a transition to the opacity
            newDiv.style.transition = 'opacity 2s';
            
            document.getElementById('rightSideDiv').appendChild(newDiv);

            // Wait for 2 seconds
            setTimeout(function() {
                // Start the fade out
                newDiv.style.opacity = '0';

                // Wait for the transition to finish and then remove the div
                setTimeout(function() {
                    newDiv.parentNode.removeChild(newDiv);
                }, 500); // the duration of the fade out
            }, 2000); // the delay before the fade out starts

    } else {
        updateUserStatus();
    }
    return data;
}

updateUserStatus();

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const logindata = await login();
    
    if (logindata && logindata.user && typeof(logindata.user.aud) !== 'undefined' && logindata.user.aud === 'authenticated') {
        window.location.href = "/dashboard.html";
    }    
});