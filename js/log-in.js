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

