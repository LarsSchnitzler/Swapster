import { supa } from "../SupaBaseClient/supabase.js";

const signUpButton = document.getElementById('log-in-button');

signUpButton.addEventListener('click', async (event) => {
    event.preventDefault();
    signUp();
});


async function signUp() {
    const email = document.getElementById('email').value;



      const { data, error } = await supa.auth.signInWithOtp({
        email: email
        });

      if(error){
        console.log(error);
        return;
      }

      alert("Magic Link versendet. Überprüfe deine Emails.");

    }

    supa.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
            console.log("User signed in: ", session.user);
            updateUserStatus(session.user);
        } else if (event === "SIGNED_OUT") {
            console.log("User signed out");
            updateUserStatus(null);
        }
      });
